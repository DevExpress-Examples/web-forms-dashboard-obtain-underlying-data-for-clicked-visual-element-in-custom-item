using DevExpress.DashboardCommon;
using DevExpress.DashboardWeb;
using DevExpress.DataAccess.ConnectionParameters;
using DevExpress.DataAccess.Sql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;

namespace WebApplication18 {
    public class Global : System.Web.HttpApplication {

        protected void Application_Start(object sender, EventArgs e) {
            DashboardFileStorage newDashboardStorage = new DashboardFileStorage(@"~/App_Data/Dashboards");
            DashboardService.SetDashboardStorage(newDashboardStorage);
        }
    }
}