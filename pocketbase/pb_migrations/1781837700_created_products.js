/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      { "autogeneratePattern": "[a-z0-9]{15}", "hidden": false, "id": "text3208210256", "max": 15, "min": 15, "name": "id", "pattern": "^[a-z0-9]+$", "presentable": false, "primaryKey": true, "required": true, "system": true, "type": "text" },
      { "hidden": false, "id": "q2pyq7b7", "name": "name", "required": true, "system": false, "type": "text" },
      { "hidden": false, "id": "3mtdn8ro", "name": "hindiName", "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "hwpaxfdp", "name": "slug", "required": true, "system": false, "type": "text", "unique": true },
      { "hidden": false, "id": "fqok3zaq", "name": "image", "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "pg5doyk0", "name": "category", "required": true, "system": false, "type": "text" },
      { "hidden": false, "id": "y3qcz4hs", "name": "medium", "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "ylen4nxh", "name": "price", "required": true, "system": false, "type": "number" },
      { "hidden": false, "id": "gxlj0thx", "name": "description", "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "vomlx7ue", "name": "story", "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "e0fh0qmp", "name": "dimensions", "required": false, "system": false, "type": "text" },
      { "hidden": false, "id": "alwa2jcf", "name": "featured", "required": false, "system": false, "type": "bool" },
      { "hidden": false, "id": "dzgqxupv", "name": "sold", "required": false, "system": false, "type": "bool" },
      { "hidden": false, "id": "svjqzolh", "name": "year", "required": false, "system": false, "type": "number" },
      { "hidden": false, "id": "pjt1tv4a", "name": "inStock", "required": false, "system": false, "type": "bool" },
    ],
    "id": "pbc_4092854851",
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
  const collection = app.findCollectionByNameOrId("pbc_4092854851");
  return app.delete(collection);
})
