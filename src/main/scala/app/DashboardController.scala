package app

import service._
import util.{UsersAuthenticator, Keys}
import util.Implicits._

class DashboardController extends DashboardControllerBase
  with IssuesService with PullRequestService with RepositoryService with AccountService
  with UsersAuthenticator

trait DashboardControllerBase extends ControllerBase {
  self: IssuesService with PullRequestService with RepositoryService with UsersAuthenticator =>

  get("/dashboard/issues/repos")(usersOnly {
    searchIssues("all")
  })

  get("/dashboard/issues/assigned")(usersOnly {
    searchIssues("assigned")
  })

  get("/dashboard/issues/created_by")(usersOnly {
    searchIssues("created_by")
  })

  get("/dashboard/pulls")(usersOnly {
    searchPullRequests("created_by", None)
  })

  get("/dashboard/pulls/owned")(usersOnly {
    searchPullRequests("created_by", None)
  })

  get("/dashboard/pulls/public")(usersOnly {
    searchPullRequests("not_created_by", None)
  })

  get("/dashboard/pulls/for/:owner/:repository")(usersOnly {
    searchPullRequests("all", Some(params("owner") + "/" + params("repository")))
  })

  private def searchIssues(filter: String) = {
    import IssuesService._

    // condition
    val condition = session.putAndGet(Keys.Session.DashboardIssues,
      if(request.hasQueryString) IssueSearchCondition(request)
      else session.getAs[IssueSearchCondition](Keys.Session.DashboardIssues).getOrElse(IssueSearchCondition())
    )

    val userName   = context.loginAccount.get.userName
    val userRepos  = getUserRepositories(userName, context.baseUrl, true).map(repo => repo.owner -> repo.name)
    //val filterUser = Map(filter -> userName)
    val page = IssueSearchCondition.page(request)

    dashboard.html.issues(
        dashboard.html.issueslist(
            searchIssue(condition, false, (page - 1) * IssueLimit, IssueLimit, userRepos: _*),
            page,
            countIssue(condition.copy(state = "open"  ), false, userRepos: _*),
            countIssue(condition.copy(state = "closed"), false, userRepos: _*),
            condition),
        countIssue(condition.copy(assigned = None, author = None), false, userRepos: _*),
        countIssue(condition.copy(assigned = Some(userName), author = None), false, userRepos: _*),
        countIssue(condition.copy(assigned = None, author = Some(userName)), false, userRepos: _*),
        countIssueGroupByRepository(condition, false, userRepos: _*),
        condition,
        filter)    
    
  }

  private def searchPullRequests(filter: String, repository: Option[String]) = {
    import IssuesService._
    import PullRequestService._

    // condition
    val condition = session.putAndGet(Keys.Session.DashboardPulls, {
      if(request.hasQueryString) IssueSearchCondition(request)
      else session.getAs[IssueSearchCondition](Keys.Session.DashboardPulls).getOrElse(IssueSearchCondition())
    }.copy(repo = repository))

    val userName   = context.loginAccount.get.userName
    val allRepos   = getAllRepositories(userName)
    val userRepos  = getUserRepositories(userName, context.baseUrl, true).map(repo => repo.owner -> repo.name)
    val filterUser = Map(filter -> userName)
    val page = IssueSearchCondition.page(request)

    val counts = countIssueGroupByRepository(
      IssueSearchCondition().copy(state = condition.state), true, userRepos: _*)

    dashboard.html.pulls(
      dashboard.html.pullslist(
        searchIssue(condition, true, (page - 1) * PullRequestLimit, PullRequestLimit, allRepos: _*),
        page,
        countIssue(condition.copy(state = "open"  ), true, allRepos: _*),
        countIssue(condition.copy(state = "closed"), true, allRepos: _*),
        condition,
        None,
        false),
      getAllPullRequestCountGroupByUser(condition.state == "closed", userName),
      userRepos.map { case (userName, repoName) =>
        (userName, repoName, counts.find { x => x._1 == userName && x._2 == repoName }.map(_._3).getOrElse(0))
      }.sortBy(_._3).reverse,
      condition,
      filter)

  }


}
