/**
 * Created by alfmagne1 on 16/08/16.
 */
if(window.DG == undefined)window.DG = {};

DG.ListView = function (config) {
    this.renderTo = $(config.renderTo);
    if(config.jsonToDataFn != undefined)this.jsonToDataFn = config.jsonToDataFn;
    if(config.tpl != undefined)this.tpl = config.tpl;
    if(config.listeners != undefined)this.listeners = config.listeners;
    this.usesTplFunction = $.type(this.tpl) == "function";
    this.configure();
};

$.extend(DG.ListView.prototype, {

    renderTo:undefined,
    jsonToDataFn : undefined,
    tpl: undefined,

    listeners:undefined,

    data:undefined,

    tplCols:undefined,

    selectedItem:undefined,

    usesTplFunction:undefined,

    configure:function(){
        if($.type(this.tpl) == "string"){
            this.saveColumnsFromTpl();
        }
    },

    saveColumnsFromTpl:function(){
        this.tplCols = [];

        cols = this.tpl.match(/{([^\}]+?)}/g);
        for(var i=0;i<cols.length;i++){
            this.tplCols.push(cols[i].replace(/[{}]/g, ""));
        }

    },

    setData:function(json){
        this.processJSON(json);
    },

    load:function(url){

        $.ajax({
            method:"post",
            dataType: 'json',
            url: url,
            success:function(json){
                this.processJSON(json);
            }.bind(this)
        });
    },

    processJSON:function(json){
        if(this.jsonToDataFn != undefined){
            this.data = this.jsonToDataFn.call(this, json);
        }else{
            this.data = json;
        }
        this.renderList();
    },

    renderList:function(){
        this.clearList();

        for(var i=0,len = this.data.length;i<len; i++){
            this.renderListItem(this.data[i]);
        }
    },

    renderListItem:function(row){
        var el;

        if(this.usesTplFunction){
            var html = this.tpl.call(this, row);
            el = $(html);
        }else{
            var tpl = this.tpl;
            for(var i=0;i<this.tplCols.length;i++){
                if(row[this.tplCols[i]] != undefined){
                    tpl = tpl.replace('{' + this.tplCols[i] + '}', row[this.tplCols[i]]);
                }
            }
            el = $(tpl);
        }

        this.renderTo.append(el);
        el.on("click", this.onItemClick.bind(this, row, el));
    },

    onItemClick:function(row, el){
        this.fireEvent("click", [row]);


        if(this.selectedItem != undefined){
            this.selectedItem.removeClass("dg-listview-item-selected");
        }

        el.addClass("dg-listview-item-selected");
        this.selectedItem = el;

    },

    clearList:function(){
        this.renderTo.html("");
    },

    fireEvent:function(name, data){
        if(this.listeners != undefined && this.listeners[name] != undefined){
            this.listeners[name].apply(this, data);
        }
    }
});

