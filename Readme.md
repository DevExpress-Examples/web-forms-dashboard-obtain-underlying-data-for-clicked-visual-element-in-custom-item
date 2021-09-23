<!-- default badges list -->
![](https://img.shields.io/endpoint?url=https://codecentral.devexpress.com/api/v1/VersionRange/128580467/20.1.2%2B)
[![](https://img.shields.io/badge/Open_in_DevExpress_Support_Center-FF7200?style=flat-square&logo=DevExpress&logoColor=white)](https://supportcenter.devexpress.com/ticket/details/T542288)
[![](https://img.shields.io/badge/📖_How_to_use_DevExpress_Examples-e9f6fc?style=flat-square)](https://docs.devexpress.com/GeneralInformation/403183)
<!-- default badges end -->

# Dashboard for Web Forms - How to Obtain Underlying Data for a Clicked Visual Element in Custom Item

This example shows how to obtain underlying data in a custom dashboard item when a user clicks the item's visual element. The custom item is based on [dashboard-extension-funnel-d3-item](https://github.com/DevExpress/dashboard-extensions/blob/master/docs/funnel-d3-item.md). The following code is used to display underlying data in the [dxPopup](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxPopup/) DevExtreme UI component:

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


<!-- default file list -->
## Files to Look At

* [Default.aspx](./CS/Default.aspx) (VB: [Default.aspx](./VB/Default.aspx))
* [Default.aspx.cs](./CS/Default.aspx.cs) (VB: [Default.aspx.vb](./VB/Default.aspx.vb))
* [funnel.js](./CS/Scripts/Funnel/funnel.js) (VB: [funnel.js](./VB/Scripts/Funnel/funnel.js))
<!-- default file list end -->

## Documentation

- [ASP.NET Web Forms Dashboard Control - Client-Side API Overview](https://docs.devexpress.com/Dashboard/116302/web-dashboard/aspnet-web-forms-dashboard-control/client-side-api-overview)
- [Obtain Underlying and Displayed Data in ASP.NET Web Forms Dashboard Control](https://docs.devexpress.com/Dashboard/18078/web-dashboard/aspnet-web-forms-dashboard-control/obtain-underlying-and-displayed-data)
- [Create a Custom Item](https://docs.devexpress.com/Dashboard/117546/web-dashboard/ui-elements-and-customization/create-a-custom-item)
- [Extensions Overview](https://docs.devexpress.com/Dashboard/117543/web-dashboard/ui-elements-and-customization/extensions-overview)
- [ViewerApiExtension](https://docs.devexpress.com/Dashboard/js-DevExpress.Dashboard.ViewerApiExtension)

## More Examples

- [Dashboard for Web Forms - How to show underlying data in a custom grid dashboard item](https://github.com/DevExpress-Examples/how-to-show-underlying-data-in-a-custom-grid-dashboard-item-t524194)
- [Dashboard for Web Forms - How to get data from a clicked dashboard item](https://github.com/DevExpress-Examples/Web-Dashboard---How-to-get-data-from-a-clicked-dashboard-item)
- [Dashboard for Web Forms - How to obtain a dashboard item's underlying data for a clicked visual element](https://github.com/DevExpress-Examples/aspxdashboard-how-to-obtain-a-dashboard-items-underlying-data-for-a-clicked-visual-element-t492257)
- [Dashboard for Web Forms - How to obtain underlying data for the specified dashboard item](https://github.com/DevExpress-Examples/aspxdashboard-how-to-obtain-underlying-data-for-the-specified-dashboard-item-t518504)
- [Dashboard for ASP.NET Core - How to obtain a dashboard item's client data](https://github.com/DevExpress-Examples/asp-net-core-dashboard-get-client-data)
- [Dashboard for ASP.NET Core  - How to obtain a dashboard item's underlying data for a clicked visual element](https://github.com/DevExpress-Examples/asp-net-core-dashboard-get-underlying-data-for-clicked-item)
- [Dashboard for ASP.NET Core  - How to obtain underlying data for the specified dashboard item](https://github.com/DevExpress-Examples/asp-net-core-dashboard-display-item-underlying-data)
