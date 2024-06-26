<!-- default badges list -->
![](https://img.shields.io/endpoint?url=https://codecentral.devexpress.com/api/v1/VersionRange/128580467/19.1.3%2B)
[![](https://img.shields.io/badge/Open_in_DevExpress_Support_Center-FF7200?style=flat-square&logo=DevExpress&logoColor=white)](https://supportcenter.devexpress.com/ticket/details/T542288)
[![](https://img.shields.io/badge/📖_How_to_use_DevExpress_Examples-e9f6fc?style=flat-square)](https://docs.devexpress.com/GeneralInformation/403183)
[![](https://img.shields.io/badge/💬_Leave_Feedback-feecdd?style=flat-square)](#does-this-example-address-your-development-requirementsobjectives)
<!-- default badges end -->
<!-- default file list -->
*Files to look at*:

* **[Default.aspx](./CS/Default.aspx) (VB: [Default.aspx](./VB/Default.aspx))**
* [Default.aspx.cs](./CS/Default.aspx.cs) (VB: [Default.aspx.vb](./VB/Default.aspx.vb))
* [funnel.js](./CS/Scripts/Funnel/funnel.js) (VB: [funnel.js](./VB/Scripts/Funnel/funnel.js))
<!-- default file list end -->
# Web Dashboard - How to Obtain Underlying Data for a Clicked Visual Element in Custom Item

This example demonstrates how to obtain underlying data in a custom dashboard item when clicking its visual element. The custom item is based on [dashboard-extension-funnel-d3-item](https://github.com/DevExpress/dashboard-extensions/blob/master/docs/funnel-d3-item.md). To display underlying data, the following code is used:

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


<!-- feedback -->
## Does this example address your development requirements/objectives?

[<img src="https://www.devexpress.com/support/examples/i/yes-button.svg"/>](https://www.devexpress.com/support/examples/survey.xml?utm_source=github&utm_campaign=web-forms-dashboard-obtain-underlying-data-for-clicked-visual-element-in-custom-item&~~~was_helpful=yes) [<img src="https://www.devexpress.com/support/examples/i/no-button.svg"/>](https://www.devexpress.com/support/examples/survey.xml?utm_source=github&utm_campaign=web-forms-dashboard-obtain-underlying-data-for-clicked-visual-element-in-custom-item&~~~was_helpful=no)

(you will be redirected to DevExpress.com to submit your response)
<!-- feedback end -->
