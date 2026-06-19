/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != ''",
    "deleteRule": null,
    "fields": [
      { "autogeneratePattern": "[a-z0-9]{15}", "hidden": false, "id": "text3208210256", "max": 15, "min": 15, "name": "id", "pattern": "^[a-z0-9]+$", "presentable": false, "primaryKey": true, "required": true, "system": true, "type": "text" },
      { "hidden": false, "id": "a1b2c3d4e5", "max": null, "min": null, "name": "order_id", "presentable": false, "required": true, "system": false, "type": "text", "unique": true },
      { "hidden": false, "id": "f6g7h8i9j0", "max": null, "min": null, "name": "user_id", "presentable": false, "required": true, "system": false, "type": "text" },
      { "hidden": false, "id": "k1l2m3n4o5", "max": null, "min": null, "name": "items", "presentable": false, "required": true, "system": false, "type": "json" },
      { "hidden": false, "id": "p6q7r8s9t0", "max": null, "min": null, "name": "subtotal", "presentable": false, "required": true, "system": false, "type": "number" },
      { "hidden": false, "id": "u1v2w3x4y5", "max": null, "min": null, "name": "shipping", "presentable": false, "required": true, "system": false, "type": "number" },
      { "hidden": false, "id": "z6a7b8c9d0", "max": null, "min": null, "name": "total", "presentable": false, "required": true, "system": false, "type": "number" },
      { "hidden": false, "id": "e1f2g3h4i5", "max": null, "min": null, "name": "address", "presentable": false, "required": true, "system": false, "type": "json" },
      { "hidden": false, "id": "j6k7l8m9n0", "max": null, "min": null, "name": "payment_method", "presentable": false, "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "o1p2q3r4s5", "maxSelect": 1, "maxSize": 5242880, "mimeTypes": ["image/jpeg","image/png","image/webp"], "name": "payment_screenshot", "presentable": false, "protected": false, "required": false, "system": false, "type": "file" },
      { "hidden": false, "id": "t6u7v8w9x0", "name": "payment_verified", "presentable": false, "required": false, "system": false, "type": "bool" },
      { "hidden": false, "id": "y1z2a3b4c5", "max": null, "min": null, "name": "status", "presentable": false, "required": true, "system": false, "type": "select", "values": ["pending_payment","payment_submitted","payment_verified","in_progress","packed","shipped","delivered","cancelled"] },
      { "hidden": false, "id": "d6e7f8g9h0", "max": null, "min": null, "name": "notes", "presentable": false, "required": false, "system": false, "type": "text" }
    ],
    "id": "pbc_1000000003",
    "indexes": [],
    "listRule": null,
    "name": "orders",
    "noAuth": false,
    "sortRule": null,
    "updateRule": "@request.auth.collectionName = '_superusers'",
    "viewRule": null,
    "type": "base"
  });
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1000000003");
  return app.delete(collection);
});
