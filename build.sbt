name := "gitbucket"

version := "0.1.0-SNAPSHOT"

libraryDependencies += "javax.servlet" % "javax.servlet-api" % "3.0.1" % "provided"

jetty()

javacOptions ++= Seq("-g")