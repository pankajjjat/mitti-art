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
        "id": "a1b2c3d4e5",
        "max": null,
        "min": null,
        "name": "title",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "f6g7h8i9j0",
        "max": null,
        "min": null,
        "name": "slug",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text",
        "unique": true
      },
      {
        "hidden": false,
        "id": "k1l2m3n4o5",
        "max": null,
        "min": null,
        "name": "description",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "p6q7r8s9t0",
        "max": null,
        "min": null,
        "name": "price",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "u1v2w3x4y5",
        "max": null,
        "min": null,
        "name": "sale_price",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "z0a1b2c3d4",
        "max": null,
        "min": null,
        "name": "category",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "e5f6g7h8i9",
        "max": null,
        "min": null,
        "name": "materials",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "j0k1l2m3n4",
        "max": null,
        "min": null,
        "name": "dimensions",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "o5p6q7r8s9",
        "max": null,
        "min": null,
        "name": "weight",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "t0u1v2w3x4",
        "name": "stock",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "y5z0a1b2c3",
        "name": "featured",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "d4e5f6g7h8",
        "max": null,
        "min": null,
        "name": "images",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "i9j0k1l2m3",
        "max": null,
        "min": null,
        "name": "seo_title",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "n4o5p6q7r8",
        "max": null,
        "min": null,
        "name": "seo_description",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "s9t0u1v2w3",
        "max": null,
        "min": null,
        "name": "availability",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      }
    ],
    "id": "pbc_1000000001",
    "indexes": [],
    "listRule": "",
    "name": "products",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1000000001");
  return app.delete(collection);
})
