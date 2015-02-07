package service

import model.{Account, Issue, Session}
import org.json4s.{DefaultFormats, Formats}
import servlet.RedisClient
import util.Implicits.request2Session

/**
 * This service is used for a view helper mainly.
 *
 * It may be called many times in one request, so each method stores
 * its result into the cache which available during a request.
 */
trait RequestCache extends SystemSettingsService with AccountService with IssuesService {
  implicit protected def jsonFormats: Formats = DefaultFormats

  private implicit def context2Session(implicit context: app.Context): Session =
    request2Session(context.request)

  def getIssue(userName: String, repositoryName: String, issueId: String)
              (implicit context: app.Context): Option[Issue] = {
    context.cache(s"issue.${userName}/${repositoryName}#${issueId}"){
      super.getIssue(userName, repositoryName, issueId)
    }
  }

  def getAccountByUserName(userName: String)
                          (implicit context: app.Context): Option[Account] = {
    RedisClient.clients.withClient { client =>
      val key = s"account.${userName}"
      client.get(key).map { value =>
        Some(org.json4s.jackson.Serialization.read[Account](value))
      }.getOrElse {
        val account = super.getAccountByUserName(userName)
        account.map { account =>
          val value = org.json4s.jackson.Serialization.write(account)
          client.set(key, value)
        }
        account
      }
    }
  }

  def getAccountByMailAddress(mailAddress: String)
                             (implicit context: app.Context): Option[Account] = {
    context.cache(s"account.${mailAddress}"){
      super.getAccountByMailAddress(mailAddress)
    }
  }
}
