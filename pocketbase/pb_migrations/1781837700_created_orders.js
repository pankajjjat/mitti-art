/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      { "autogeneratePattern": "[a-z0-9]{15}", "hidden": false, "id": "text3208210256", "max": 15, "min": 15, "name": "id", "pattern": "^[a-z0-9]+$", "presentable": false, "primaryKey": true, "required": true, "system": true, "type": "text" },
      { "hidden": false, "id": "pg0ndnc0", "name": "productName", "required": true, "system": false, "type": "text" },
      { "hidden": false, "id": "7ueigbgq", "name": "customerName", "required": true, "system": false, "type": "text" },
      { "hidden": false, "id": "mvn0odnp", "name": "customerEmail", "required": true, "system": false, "type": "email" },
      { "hidden": false, "id": "fxqevhkz", "name": "customerPhone", "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "epxz3kvf", "name": "message", "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "dwp91mmi", "name": "status", "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "a92fypnq", "name": "total", "required": false, "system": false, "type": "number" },
    ],
    "id": "pbc_3527180448",
    "indexes": [],
    "listRule": null,
    "name": "orders",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448");
  return app.delete(collection);
})
