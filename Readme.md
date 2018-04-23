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


