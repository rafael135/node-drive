/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';
import Auth from 'App/Middleware/Auth';

Route.group(() => {
	Route.group(() => {
		Route.post("/login", "AuthController.login");
		Route.post("/register", "AuthController.register");

		Route.post("/checkToken", "AuthController.checkToken").middleware(["auth"]);

		Route.post("/files", "FilesController.getFoldersAndFilesFrom").middleware(["auth"]);

		Route.group(() => {
			Route.get("/download/:filePath", "FilesController.downloadFile").middleware(["auth"]).where("filePath", { cast: (path) => String(path) });

			Route.post("/upload", "FilesController.uploadFile").middleware(["auth"]);

			Route.put("/make/public", "FilesController.makeFilePublic").middleware(["auth"]);

			Route.get("/view", "FilesController.viewFile").middleware(["auth"]);

			Route.delete("/", "FilesController.deleteFile").middleware(["auth"]);

			Route.post("/new/folder", "FilesController.newFolder").middleware(["auth"]);
		}).prefix("/files");

	}).prefix("/user");
	
}).prefix("/api");

