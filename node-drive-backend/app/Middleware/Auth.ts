import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Env from '@ioc:Adonis/Core/Env';
import JWT from "jsonwebtoken";

export default class Auth {
  	public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
		if(request.header("Authorization")) {
			let success = false;

        	let [authType, token] = request.header("Authorization")!.split(' ');

        	if(authType == "Bearer") {
            	try {
                	const decoded = JWT.verify(token, Env.get("APP_KEY"));
                	success = true;
            	}catch(err) {
					response.status(401);
					return response.send({
						status: 401
					});
            	}


        	}

			if(success.valueOf() == true) {
				response.status(200);
				return await next();
			}
		}

		response.status(401);
		return response.send({
			status: 401
		});

  	}
}
