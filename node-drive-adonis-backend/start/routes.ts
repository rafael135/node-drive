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

		Route.get("/files", "FilesController.getFoldersAndFilesForUser").middleware(["auth"]);

		Route.group(() => {
			Route.get("/download", "FilesController.downloadFile").middleware(["auth"]);

			Route.get("/multiple/download", "FilesController.downloadFilesCompacted").middleware(["auth"]).where("files", { cast: (file) => Array.of(file) });

			Route.post("/upload", "FilesController.uploadFile").middleware(["auth"]);

			Route.get("/public/max", "UserController.getMaxSharedFilesQte").middleware(["auth"]);

			Route.get("/public/url", "FilesController.getPublicFileUrl");

			Route.get("/public/info", "FilesController.getPublicFileInfo");

			Route.get("/public/:userId", "FilesController.getUserPublicFiles").middleware(["auth"]);

			Route.put("/public", "FilesController.makeFilePublic").middleware(["auth"]);

			Route.get("/view", "FilesController.viewFile").middleware(["auth"]);

			Route.get("/search", "FilesController.searchUserFiles").middleware(["auth"]);

			Route.delete("/", "FilesController.deleteFile").middleware(["auth"]);

			Route.post("/new/folder", "FilesController.newFolder").middleware(["auth"]);

			Route.put("/rename", "FilesController.renameFileOrFolder").middleware(["auth"]);

			
		}).prefix("/files");

		Route.get("/:userId/files/public/download", "FilesController.downloadPublicFile");

		Route.get("/:userId/video", "VideosController.streamVideo");


		Route.group(() => {
			Route.put("/avatar", "UserController.changeAvatar").middleware(["auth"]);

			Route.put("/email", "UserController.changeEmail").middleware(["auth"]);

			Route.put("/name", "UserController.changeName").middleware(["auth"]);

			Route.put("/plan", "UserController.changeStoragePlan").middleware(["auth"]);
		}).prefix("/change");

	}).prefix("/user");

	Route.group(() => {
		Route.get("/search", "FilesController.searchPublicFiles").middleware(["auth"]);
	}).prefix("/files");


	Route.get("/storageTypes", "StorageTypeController.getStorageTypes");
	
}).prefix("/api");

