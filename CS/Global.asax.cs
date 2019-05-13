using DevExpress.DashboardWeb;
using System;

namespace WebApplication18
{
    public class Global : System.Web.HttpApplication {

        protected void Application_Start(object sender, EventArgs e) {
            DashboardFileStorage newDashboardStorage = new DashboardFileStorage(@"~/App_Data/Dashboards");
            DashboardConfigurator.Default.SetDashboardStorage(newDashboardStorage);
        }
    }
}