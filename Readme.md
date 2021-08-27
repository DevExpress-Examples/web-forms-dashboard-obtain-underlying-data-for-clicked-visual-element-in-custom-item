<!-- default badges list -->
![](https://img.shields.io/endpoint?url=https://codecentral.devexpress.com/api/v1/VersionRange/128580467/17.1.5%2B)
[![](https://img.shields.io/badge/Open_in_DevExpress_Support_Center-FF7200?style=flat-square&logo=DevExpress&logoColor=white)](https://supportcenter.devexpress.com/ticket/details/T542288)
[![](https://img.shields.io/badge/📖_How_to_use_DevExpress_Examples-e9f6fc?style=flat-square)](https://docs.devexpress.com/GeneralInformation/403183)
<!-- default badges end -->
<!-- default file list -->
*Files to look at*:

* **[Default.aspx](./CS/Default.aspx) (VB: [Default.aspx](./VB/Default.aspx))**
* [Default.aspx.cs](./CS/Default.aspx.cs) (VB: [Default.aspx.vb](./VB/Default.aspx.vb))
* [funnel.js](./CS/Scripts/Funnel/funnel.js) (VB: [funnel.js](./VB/Scripts/Funnel/funnel.js))
<!-- default file list end -->
# Web Dashboard - How to Obtain Underlying Data for a Clicked Visual Element in Custom Item


<p>This example demonstrates how to obtain underlying data in a custom dashboard item when clicking its visual element. The custom item is based on <a href="https://github.com/DevExpress/dashboard-extension-funnel-d3-item">dashboard-extension-funnel-d3-item</a>. To display underlying data, the following code is used:</p>
<br>


```js
    funnelD3Item.prototype._showUnderlyingData = function (arguments) {
        var clientData = webDashboard.GetItemData(this.getName());
        var columns = clientData.GetDataMembers();
        var requestParameters = {
            DataMembers: columns,
            UniqueValuesByAxisName: { "Default": arguments }
        };
        webDashboard.RequestUnderlyingData(this.getName(), requestParameters, function (data) {
            var underlyingData = [];
            dataMembers = data.GetDataMembers();
            for (var i = 0; i < data.GetRowCount() ; i++) {
                var dataTableRow = {};
                $.each(dataMembers, function (_, dataMember) {
                    dataTableRow[dataMember] = data.GetRowValue(i, dataMember);
                });
                underlyingData.push(dataTableRow);
            }
            var popup = $("#myPopup").dxPopup({
                height: 800,
                showTitle: true,
                title: "Underlying Data",
                visible: true,
                contentTemplate: function () {
                    return $('<div/>').dxDataGrid({
                        height: 800,
                        scrolling: {
                            mode: 'virtual'
                        },
                        dataSource: underlyingData
                    });
                }
            });
        });
    }
```



<br/>


