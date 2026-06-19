/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "a1b2c3d4e6",
        "max": null,
        "min": null,
        "name": "customer_name",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "f7g8h9i0j1",
        "max": null,
        "min": null,
        "name": "review",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "k2l3m4n5o6",
        "max": null,
        "min": null,
        "name": "rating",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "p7q8r9s0t1",
        "maxSelect": 1,
        "maxSize": 0,
        "mimeTypes": [],
        "name": "photo",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "type": "file"
      },
      {
        "hidden": false,
        "id": "u2v3w4x5y6",
        "name": "featured",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "bool"
      }
    ],
    "id": "pbc_1000000004",
    "indexes": [],
    "listRule": "",
    "name": "testimonials",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1000000004");
  return app.delete(collection);
})
