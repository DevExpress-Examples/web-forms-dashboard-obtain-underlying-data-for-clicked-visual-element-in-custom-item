Imports DevExpress.DashboardCommon
Imports DevExpress.DashboardWeb
Imports DevExpress.DataAccess.ConnectionParameters
Imports DevExpress.DataAccess.Sql
Imports System
Imports System.Collections.Generic
Imports System.Linq
Imports System.Web
Imports System.Web.Security
Imports System.Web.SessionState

Namespace WebApplication18
    Public Class [Global]
        Inherits System.Web.HttpApplication

        Protected Sub Application_Start(ByVal sender As Object, ByVal e As EventArgs)
            Dim newDashboardStorage As New DashboardFileStorage("~/App_Data/Dashboards")
            DashboardService.SetDashboardStorage(newDashboardStorage)
        End Sub
    End Class
End Namespace