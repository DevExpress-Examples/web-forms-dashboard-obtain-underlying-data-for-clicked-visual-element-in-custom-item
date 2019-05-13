Imports DevExpress.DashboardWeb
Imports System

Namespace WebApplication18
	Public Class [Global]
		Inherits System.Web.HttpApplication

		Protected Sub Application_Start(ByVal sender As Object, ByVal e As EventArgs)
			Dim newDashboardStorage As New DashboardFileStorage("~/App_Data/Dashboards")
			DashboardConfigurator.Default.SetDashboardStorage(newDashboardStorage)
		End Sub
	End Class
End Namespace