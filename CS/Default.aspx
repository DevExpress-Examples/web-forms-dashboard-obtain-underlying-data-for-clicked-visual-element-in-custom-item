<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="WebApplication18.Default" %>

<%@ Register Assembly="DevExpress.Dashboard.v20.1.Web.WebForms, Version=20.1.11.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a" Namespace="DevExpress.DashboardWeb" TagPrefix="dx" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>

    <script type="text/javascript">
        function onBeforeRender(s, e) {
            var dashboardControl = s.getDashboardControl();
            dashboardControl.registerExtension(new FunnelD3ItemExtension(dashboardControl));
        }
    </script>

</head>
<body>
    <form id="form1" runat="server">
        <div>
            <div id="myPopup"></div>

            <dx:ASPxDashboard ID="ASPxDashboardControl1" ClientInstanceName="webDashboard" runat="server" UseDashboardConfigurator="true">
                <ClientSideEvents BeforeRender="onBeforeRender" />
            </dx:ASPxDashboard>

            <script src="Scripts/Funnel/d3.v4.min.js"></script>
            <script src="Scripts/Funnel/d3-funnel.min.js"></script>
            <script src="Scripts/Funnel/funnel.js"></script>
        </div>
    </form>
</body>
</html>
