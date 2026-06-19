/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      { "autogeneratePattern": "[a-z0-9]{15}", "hidden": false, "id": "text3208210256", "max": 15, "min": 15, "name": "id", "pattern": "^[a-z0-9]+$", "presentable": false, "primaryKey": true, "required": true, "system": true, "type": "text" },
      { "hidden": false, "id": "kz4gsuxj", "name": "email", "required": true, "system": false, "type": "email", "unique": true },
      { "hidden": false, "id": "vxcifxtq", "name": "name", "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "vlri6dio", "name": "active", "required": false, "system": false, "type": "bool" },
    ],
    "id": "pbc_2430072404",
    "indexes": [],
    "listRule": null,
    "name": "subscribers",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2430072404");
  return app.delete(collection);
})
