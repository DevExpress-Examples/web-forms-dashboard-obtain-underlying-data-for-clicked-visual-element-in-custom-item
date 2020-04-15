var FunnelD3ItemExtension = (function() {

    var Dashboard = DevExpress.Dashboard;
    var Designer = DevExpress.Dashboard.Designer;
    var Model = DevExpress.Dashboard.Model;
    var dxPopup = DevExpress.ui.dxPopup;
    var dxDataGrid = DevExpress.ui.dxDataGrid;

    var svgIcon = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="FunnelD3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"     viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><style type="text/css">    .dx_red{fill:#E25454;}    .dx_blue{fill:#579ADD;}    .dx_green{fill:#39A866;}</style><polygon class="dx_green" points="2,1 22,1 16,8 8,8 "/><polygon class="dx_blue" points="8,9 16,9 14,15 10,15 "/><polygon class="dx_red" points="10,16 14,16 13,23 11,23 "/></svg>';

    var funnelMeta = {
        bindings: [{
            propertyName: 'Values',
            dataItemType: 'Measure',
            array: true,
            enableColoring: true,
            displayName: 'Values',
            emptyPlaceholder: 'Set Value',
            selectedPlaceholder: 'Configure Value'
        }, {
            propertyName: 'Arguments',
            dataItemType: 'Dimension',
            array: true,
            enableInteractivity: true,
            enableColoring: true,
            displayName: 'Arguments',
            emptyPlaceholder: 'Set Argument',
            selectedPlaceholder: 'Configure Argument'
        }],
        
        customProperties: [{
            ownerType: Model.CustomItem,
            propertyName: 'FillType',
            valueType: 'string',
            defaultValue: 'Solid',
        },{
            ownerType: Model.CustomItem,
            propertyName: 'IsCurved',
            valueType: 'boolean',
            defaultValue: false,
        },{
            ownerType: Model.CustomItem,
            propertyName: 'IsDynamicHeight',
            valueType: 'boolean',
            defaultValue: true,
        }, {
            ownerType: Model.CustomItem,
            propertyName: 'PinchCount',
            valueType: 'number',
            defaultValue: 0,
        }],
        
        optionsPanelSections: [{
            title: 'Settings',
            items: [{
                dataField: 'FillType',
                template: Designer.FormItemTemplates.buttonGroup,
                editorOptions: {
                    items: [{ text: 'Solid' }, { text: 'Gradient' }]
                },
            },{
                dataField: 'IsCurved',
                label: {
                    text: 'Curved'
                },
                template: Designer.FormItemTemplates.buttonGroup,
                editorOptions: {
                    keyExpr: 'value',
                    items: [
                        { value: true, text: 'Yes', },
                        { value: false, text: 'No' }
                    ]
                },
            },{
                dataField: 'IsDynamicHeight',
                label: {
                    text: 'Dynamic Height'
                },
                template: Designer.FormItemTemplates.buttonGroup,
                editorOptions: {
                    keyExpr: 'value',
                    items: [
                        { value: true, text: 'Yes', },
                        { value: false, text: 'No' }
                    ]            },
            }, {
                dataField: 'PinchCount',
                editorType: 'dxNumberBox',
                editorOptions: { min: 0 }
            }],
        }],
        interactivity: {
            filter: true,
            drillDown: true
        },
        icon: 'FunnelD3',
        title: 'Funnel D3',
        index: 3
    };
    
    // Third party libraries: 
    // "d3js" component from https://d3js.org/ [Copyright(c) 2017 Mike Bostock]
    // "d3-funnel" component from https://jakezatecky.github.io/d3-funnel/ [Copyright(c) 2017 Jake Zatecky]
    function FunnelD3ItemViewer(dashboardControl, model, $container, options) {
        Dashboard.CustomItemViewer.call(this, model, $container, options)

        this.viewerApiExtension = dashboardControl.findExtension('viewer-api');
        this.funnelSettings = undefined;
        this.funnelViewer = null;
        this.selectionValues = [];
        this.exportingImage = new Image();
        this._subscribeProperties();
    }
    FunnelD3ItemViewer.prototype = Object.create(Dashboard.CustomItemViewer.prototype);
    FunnelD3ItemViewer.prototype.constructor = FunnelD3ItemViewer;

    FunnelD3ItemViewer.prototype.renderContent = function ($element, changeExisting) {
        var element = $element.jquery ? $element[0] : $element;
            
        var data = this._getDataSource();
        var funnelId = this._getFunnelId();
        if (!this._ensureFunnelLibrary(element))
            return;
        if (!!data) {
            if (!changeExisting || !this.funnelViewer) {
                while(element.firstChild)
                    element.removeChild(element.firstChild);
                    
                var div = document.createElement('div');
                div.id = funnelId;
                element.appendChild(div);
                    
                this.funnelViewer = new D3Funnel('#' + funnelId);
            }
            this._update(data);
        } else {
            while(element.firstChild)
                element.removeChild(element.firstChild);

            this.funnelViewer = null;
        }
    };
    FunnelD3ItemViewer.prototype.setSize = function (width, height) {
        Object.getPrototypeOf(FunnelD3ItemViewer.prototype).setSize.call(this, width, height);
        this._update(null, { chart: { width: this.contentWidth(), height: this.contentHeight() } });
    };
    FunnelD3ItemViewer.prototype.clearSelection = function () {
        Object.getPrototypeOf(FunnelD3ItemViewer.prototype).clearSelection.call(this);
        this._update(this._getDataSource());
    };
    FunnelD3ItemViewer.prototype.allowExportSingleItem = function () {
        return true;
    };
    FunnelD3ItemViewer.prototype.getExportInfo = function () {
        return {
            image: this._getImageBase64()
        };
    };
    FunnelD3ItemViewer.prototype._getDataSource = function () {
        var _this = this;
        var bindingValues = this.getBindingValue('Values');
        if (bindingValues.length == 0)
            return undefined;
        var data = [];
        this.iterateData(function (dataRow) {
            var values = dataRow.getValue('Values');
            var valueStr = dataRow.getDisplayText('Values');
            var color = dataRow.getColor('Values');
            if (_this._hasArguments()) {
                var labelText = dataRow.getDisplayText('Arguments').join(' - ') + ': ' + valueStr;
                var arguments = dataRow.getDisplayText('Arguments');
                data.push([{ data: dataRow, arguments : arguments, text: labelText, color: color[0] }].concat(values));//0 - 'layer' index for color value
            } else {
                data = values.map(function (value, index) { return [{ text: bindingValues[index].displayName() + ': ' + valueStr[index], color: color[index] }, value]; });
            }
        });
        return data.length > 0 ? data : undefined;
    };
    FunnelD3ItemViewer.prototype._ensureFunnelLibrary = function (element) {
        if (!window['D3Funnel']) {
            while(element.firstChild)
                element.removeChild(element.firstChild);
                
            var div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.top = '50%';
            div.style.transform = 'translateY(-50%)';
            div.style.color = '#CF0F2E';
            div.style.textAlign = 'center';
            div.width = '95%';
            div.innerText = "'D3Funnel' cannot be displayed. You should include 'd3.v3.min.js' and 'd3-funnel.js' libraries.";
                
            element.appendChild(div);
            return false;
        }
        return true;
    };
    FunnelD3ItemViewer.prototype._ensureFunnelSettings = function () {
        var _this = this;
        var getSelectionColor = function (hexColor) { return _this.funnelViewer.colorizer.shade(hexColor, -0.5); };
        if (!this.funnelSettings) {
            this.funnelSettings = {
                data: undefined,
                options: {
                    chart: {
                        width: this.contentWidth(),
                        height: this.contentHeight(),
                        bottomPinch: this.getPropertyValue('PinchCount'),
                        curve: { enabled: this.getPropertyValue('IsCurved') }
                    },
                    block: {
                        dynamicHeight: this.getPropertyValue('IsDynamicHeight'),
                        fill: {
                            scale: function (index) {
                                var obj = _this.funnelSettings.data[index][0];
                                return obj.data && _this.isSelected(obj.data) ? getSelectionColor(obj.color) : obj.color;
                            },
                            type: this.getPropertyValue('FillType').toLowerCase()
                        }
                    },
                    label: {
                        format: function (label, value) {
                            return label.text;
                        }
                    },
                    events: {
                        click: { block: function (e) { return _this._onClick(e); } }
                    }
                }
            };
        }
        this.funnelSettings.options.block.highlight = this.canDrillDown() || this.canMasterFilter();
        return this.funnelSettings;
    };
    FunnelD3ItemViewer.prototype._getFunnelId = function () {
        return 'dx-d3-funnel-' + this.getName();
    };
    FunnelD3ItemViewer.prototype._onClick = function (e) {
        if (!this._hasArguments() || !e.label)
            return;
        var row = e.label.raw.data;
        if (this.canDrillDown(row))
            this.drillDown(row);
        else if (this.canMasterFilter(row)) {
            this.setMasterFilter(row);
            this._update();
        }
        //Show underlying data
        var arguments = e.label.raw.arguments;
        this._showUnderlyingData(arguments);
    };
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

    FunnelD3ItemViewer.prototype._subscribeProperties = function () {
        var _this = this;
        this.subscribe('IsCurved', function (isCurved) { return _this._update(null, { chart: { curve: { enabled: isCurved } } }); });
        this.subscribe('IsDynamicHeight', function (isDynamicHeight) { return _this._update(null, { block: { dynamicHeight: isDynamicHeight } }); });
        this.subscribe('PinchCount', function (count) { return _this._update(null, { chart: { bottomPinch: count } }); });
        this.subscribe('FillType', function (type) { return _this._update(null, { block: { fill: { type: type.toLowerCase() } } }); });
    };

    FunnelD3ItemViewer.prototype._update = function (data, options) {
        this._ensureFunnelSettings();
        if (!!data) {
            this.funnelSettings.data = data;
        }
        if (!!options) {
            this._mergeOptions(this.funnelSettings.options, options);
        }
        if (!!this.funnelViewer) {
            this.funnelViewer.draw(this.funnelSettings.data, this.funnelSettings.options);
            this._updateExportingImage();
        }
    };
    FunnelD3ItemViewer.prototype._mergeOptions = function(options, newOptions) {
        var _this = this;
        Object.keys(newOptions).forEach(function(key) {
            if(typeof newOptions[key] === 'object')
                _this._mergeOptions(options[key], newOptions[key]);
            else 
                options[key] = newOptions[key];
        });
    }
    FunnelD3ItemViewer.prototype._updateExportingImage = function () {
        var svg = document.getElementById(this._getFunnelId()).firstChild,
        str = new XMLSerializer().serializeToString(svg),
        encodedData = 'data:image/svg+xml;base64,' + window.btoa(str);
        this.exportingImage.src = encodedData;
    };
    FunnelD3ItemViewer.prototype._hasArguments = function () {
        return this.getBindingValue('Arguments').length > 0;
    };
    FunnelD3ItemViewer.prototype._getImageBase64 = function () {
        var canvas = document.createElement('canvas');
        canvas['width'] = this.contentWidth();
        canvas['height'] = this.contentHeight();
        canvas['getContext']('2d').drawImage(this.exportingImage, 0, 0);
        return canvas['toDataURL']().replace('data:image/png;base64,', '');
    };

    var FunnelD3ItemExtension = function (dashboardControl) {
        dashboardControl.registerIcon(svgIcon);

        this.name = 'FunnelD3';
        this.metaData = funnelMeta;
        this.createViewerItem = function (model, $element, content) {
            return new FunnelD3ItemViewer(dashboardControl, model, $element, content);
        }
    }

        return FunnelD3ItemExtension;
})();






