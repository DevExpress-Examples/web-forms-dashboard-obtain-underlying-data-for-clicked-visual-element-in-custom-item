<!-- default file list -->
*Files to look at*:

* **[Default.aspx](./CS/Default.aspx) (VB: [Default.aspx](./VB/Default.aspx))**
* [Default.aspx.cs](./CS/Default.aspx.cs) (VB: [Default.aspx.vb](./VB/Default.aspx.vb))
* [funnel.js](./CS/Scripts/Funnel/funnel.js) (VB: [funnel.js](./VB/Scripts/Funnel/funnel.js))
<!-- default file list end -->
# Web Dashboard - How to Obtain Underlying Data for a Clicked Visual Element in Custom Item

This example demonstrates how to obtain underlying data in a custom dashboard item when clicking its visual element. The custom item is based on [dashboard-extension-funnel-d3-item](https://github.com/DevExpress/dashboard-extensions/blob/master/docs/funnel-d3-item.md). To display underlying data, the following code is used:

```js
    FunnelD3ItemViewer.prototype._showUnderlyingData = function (arguments) {
        if(!this.viewerApiExtension)
            return;

        var clientData = this.viewerApiExtension.getItemData(this.getName());
        var columns = clientData.getDataMembers();
        var requestParameters = {
            dataMembers: columns,
            uniqueValuesByAxisName: { "Default": arguments }
        };

        this.viewerApiExtension.requestUnderlyingData(this.getName(), requestParameters, function (data) {
            var underlyingData = [];
            dataMembers = data.getDataMembers();
            for (var i = 0; i < data.getRowCount() ; i++) {
                var dataTableRow = {};
                dataMembers.forEach(function(dataMember) {
                    dataTableRow[dataMember] = data.getRowValue(i, dataMember);
                });
                underlyingData.push(dataTableRow);
            }

            new dxPopup(document.getElementById('myPopup'), {
                height: 800,
                showTitle: true,
                title: "Underlying Data",
                visible: true,
                contentTemplate: function () {
                    var div = document.createElement('div');
                    new dxDataGrid(div, {
                        height: 800,
                        scrolling: {
                            mode: 'virtual'
                        },
                        dataSource: underlyingData
                    });
                    return div;
                }
            });
        });
    }
```



<br/>


