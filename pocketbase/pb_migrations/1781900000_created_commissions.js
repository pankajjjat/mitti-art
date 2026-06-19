/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != ''",
    "deleteRule": null,
    "fields": [
      { "autogeneratePattern": "[a-z0-9]{15}", "hidden": false, "id": "text3208210256", "max": 15, "min": 15, "name": "id", "pattern": "^[a-z0-9]+$", "presentable": false, "primaryKey": true, "required": true, "system": true, "type": "text" },
      { "hidden": false, "id": "ab1c2d3e4f", "max": null, "min": null, "name": "user_id", "presentable": false, "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "g5h6i7j8k9", "max": null, "min": null, "name": "name", "presentable": false, "primaryKey": false, "required": true, "system": false, "type": "text" },
      { "hidden": false, "id": "l0m1n2o3p4", "max": null, "min": null, "name": "email", "presentable": false, "primaryKey": false, "required": true, "system": false, "type": "email" },
      { "hidden": false, "id": "q5r6s7t8u9", "max": null, "min": null, "name": "phone", "presentable": false, "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "v0w1x2y3z4", "max": null, "min": null, "name": "artwork_type", "presentable": false, "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "a5b6c7d8e9", "max": null, "min": null, "name": "size", "presentable": false, "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "f0g1h2i3j4", "max": null, "min": null, "name": "budget", "presentable": false, "required": false, "system": false, "type": "number" },
      { "hidden": false, "id": "k5l6m7n8o9", "max": null, "min": null, "name": "description", "presentable": false, "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "p0q1r2s3t4", "maxSelect": 1, "maxSize": 5242880, "mimeTypes": ["image/jpeg","image/png","image/webp"], "name": "reference_image", "presentable": false, "protected": false, "required": false, "system": false, "type": "file" },
      { "hidden": false, "id": "u5v6w7x8y9", "max": null, "min": null, "name": "status", "presentable": false, "required": false, "system": false, "type": "select", "values": ["pending","approved","quoted","rejected","in_progress","completed"] },
      { "hidden": false, "id": "z0a1b2c3d4", "max": null, "min": null, "name": "admin_notes", "presentable": false, "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "e5f6g7h8i9", "max": null, "min": null, "name": "quoted_price", "presentable": false, "required": false, "system": false, "type": "number" }
    ],
    "id": "pbc_1000000002",
    "indexes": [],
    "listRule": null,
    "name": "commissions",
    "noAuth": false,
    "sortRule": null,
    "updateRule": "@request.auth.collectionName = '_superusers'",
    "viewRule": null,
    "type": "base"
  });
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1000000002");
  return app.delete(collection);
});
