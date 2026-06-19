/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      { "autogeneratePattern": "[a-z0-9]{15}", "hidden": false, "id": "text3208210256", "max": 15, "min": 15, "name": "id", "pattern": "^[a-z0-9]+$", "presentable": false, "primaryKey": true, "required": true, "system": true, "type": "text" },
      { "hidden": false, "id": "mfrdkp6s", "name": "name", "required": true, "system": false, "type": "text" },
      { "hidden": false, "id": "pcvv7xv7", "name": "email", "required": true, "system": false, "type": "email" },
      { "hidden": false, "id": "mbqls8or", "name": "phone", "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "cmzwkffo", "name": "type", "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "vltdd0nj", "name": "description", "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "jxp4po4k", "name": "budget", "required": false, "system": false, "type": "number" },
      { "hidden": false, "id": "yaozljdi", "name": "timeline", "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "6yxojewv", "name": "reference", "required": false, "system": false, "type": "text" },
    ],
    "id": "pbc_2387824824",
    "indexes": [],
    "listRule": null,
    "name": "commissions",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2387824824");
  return app.delete(collection);
})
