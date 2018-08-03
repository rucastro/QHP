define('Warehouse.Collection', [
    'Backbone',
    'Warehouse.Model'
], function WarehouseCollection(
    Backbone, 
    Model
) {
    return Backbone.Collection.extend({
      model: Model,
      url: _.getAbsoluteUrl('services/Warehouse.Service.ss')
    });
  }
);