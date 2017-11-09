var express = require('express');
var status = require('http-status');
var bodyParser = require('body-parser');
var _ = require('underscore');

// Cuando se hace la petición, la API retorna una función que pone disponibles las url
// para los métodos POST, GET, PUT o DELETE.

module.exports = function(wagner){
	var api = express.Router();
	api.use(bodyParser.json());
	
	//Permite recuperar los parámetros de la ruta.
	
	api.use(bodyParser.urlencoded({
		extended: true
	}));
	
	//RUTAS DE LAS APIS A REQUERIR.
	
	// region Paciente
	api.get('/patient/', wagner.invoke(function (Paciente){
		return function(req, res){
			return require('./controllers/patientController').getPatients(req, res, Paciente);
		};
	}));

	api.get('/patient/:_id', wagner.invoke(function (Paciente){
		return function(req, res){
			return require('./controllers/patientController').getPatient(req, res, Paciente);
		};
	}));
	
	api.post('/patient/login', wagner.invoke(function(Paciente){
		return function(req, res){
			return require('./controllers/patientController').getPatientByLogin(req, res, Paciente);
		}
	}));

	api.post('/patient/', wagner.invoke(function (Paciente){
		return function(req, res){
			return require('./controllers/patientController').newPatient(req, res, Paciente);
		};
	}));

	api.put('/patient/:_id', wagner.invoke(function(Paciente){
		return function(req, res){
			return require('./controllers/patientController').updatePatient(req, res, Paciente);
		};
	}));

	api.delete('/patient/:_id', wagner.invoke(function (Paciente){
		return function(req, res){
			return require('./controllers/patientController').deletePatient(req, res, Paciente);
		};
	}));
	//endregion Paciente

	//region Comida
	api.get('/foods/', wagner.invoke(function (Comida){
		return function(req, res){
			return require('./controllers/foodController').getFoods(req, res, Comida);
		};
	}));

	api.get('/food/:_id', wagner.invoke(function (Comida){
		return function(req, res){
			return require('./controllers/foodController').getFood(req, res, Comida);
		};
	}));

	api.post('/food/', wagner.invoke(function (Comida){
		return function(req, res){
			return require('./controllers/foodController').newFood(req, res, Comida);
		};
	}));

	api.delete('/food/:_id', wagner.invoke(function (Comida){
		return function(req, res){
			return require('./controllers/foodController').deleteFood(req, res, Comida);
		};
	}));
	
	//endregion Comida
	
	//RegistroCita
	api.get('/appointmentRegisters/', wagner.invoke(function (RegistroCita){
		return function(req, res){
			return require('./controllers/apointmentRegisterController').getAppointmentRegisters(req, res, RegistroCita);
		};
	}));

	api.get('/appointmentRegister/:_id', wagner.invoke(function (RegistroCita){
		return function(req, res){
			return require('./controllers/apointmentRegisterController').getAppointmentRegister(req, res, RegistroCita);
		};
	}));

	api.post('/appointmentRegister/', wagner.invoke(function (RegistroCita){
		return function(req, res){
			return require('./controllers/apointmentRegisterController').newAppointmentRegister(req, res, RegistroCita);
		};
	}));
	
	api.put('/appointmentRegister/:_id', wagner.invoke(function(RegistroCita){
		return function(req, res){
			return require('./controllers/apointmentRegisterController').updateAppointmentRegister(req, res, RegistroCita);
		}
	}));

	api.delete('/appointmentRegister/:_id', wagner.invoke(function (RegistroCita){
		return function(req, res){
			return require('./controllers/apointmentRegisterController').deleteAppointmentRegister(req, res, RegistroCita);
		};
	}));
	//end RegistroCita
	// Ingrediente
	api.get('/ingredient/', wagner.invoke(function (Ingrediente){
		return function(req, res){
			return require('./controllers/ingredientsController').getIngredients(req, res, Ingrediente);
		};
	}));

	api.get('/ingredient/:_id', wagner.invoke(function (Ingrediente){
		return function(req, res){
			return require('./controllers/ingredientsController').getIngredient(req, res, Ingrediente);
		};
	}));

	api.post('/ingredient/', wagner.invoke(function (Ingrediente){
		return function(req, res){
			return require('./controllers/ingredientsController').newIngredient(req, res, Ingrediente);
		};
	}));
	
	api.put('/ingredient/:_id', wagner.invoke(function(Ingrediente){
		return function(req, res){
			return require('./controllers/ingredientsController').updateIngredient(req, res, Ingrediente);
		}
	}));

	api.delete('/ingredient/:_id', wagner.invoke(function (Ingrediente){
		return function(req, res){
			return require('./controllers/ingredientsController').deleteIngredient(req, res, Ingrediente);
		};
	}));
	// end Ingrediente
	
	//region Menu
	api.get('/menu/', wagner.invoke(function(Menu){
		return function(req, res){
			return require('./controllers/menuController').getMenus(req, res, Menu);
		}
	}));
	
	api.get('/menu/:_id', wagner.invoke(function(Menu){
		return function(req, res){
			return require('./controllers/menuController').getMenu(req, res, Menu);
		}
	}));
	
	api.post('/menu/', wagner.invoke(function(Menu){
		return function(req, res){
			return require('./controllers/menuController').newMenu(req, res, Menu);
		}
	}));

	api.put('/menu/:_id', wagner.invoke(function(Menu){
		return function(req, res){
			return require('./controllers/menuController').updateMenu(req, res, Menu);
		};
	}));
	
	api.delete('/menu/:_id', wagner.invoke(function(Menu){
		return function(req, res){
			return require('./controllers/menuController').deleteMenu(req, res, Menu);
		}
	}));


	//end Menu
	
	//region Menu_Usuario
	api.get('/menu_user/', wagner.invoke(function(MenuUsuario){
		return function(req, res){
			return require('./controllers/menuCompletoController').getMenusUsers(req, res, MenuUsuario);
		}
	}));
	
	api.get('/menu_user/:_id', wagner.invoke(function(MenuUsuario){
		return function(req, res){
			return require('./controllers/menuCompletoController').getMenuUser(req, res, MenuUsuario);
		}
	}));
	
	api.post('/menu_user/', wagner.invoke(function(MenuUsuario){
		return function(req, res){
			return require('./controllers/menuCompletoController').newMenuUser(req, res, MenuUsuario);
		}
	}));
	
	api.put('/menu_user/:_id', wagner.invoke(function(MenuUsuario){
		return function(req, res){
			return require('./controllers/menuCompletoController').updateMenuUser(req, res, MenuUsuario);
		};
	}));

	api.delete('/menu_user/:_id', wagner.invoke(function(MenuUsuario){
		return function(req, res){
			return require('./controllers/menuCompletoController').deleteMenuUser(req, res, MenuUsuario);
		}
	}));
	//end Menu_Usuario
	
	//region Cita
	api.get('/appointment/', wagner.invoke(function(Cita){
		return function(req, res){
			return require('./controllers/appointmentController').getAppointments(req, res, Cita);
		}
	}));
	
	api.get('/appointment/:_id', wagner.invoke(function(Cita){
		return function(req, res){
			return require('./controllers/appointmentController').getAppointment(req, res, Cita);
		}
	}));
	
	api.get('/appointmentForDate/:date', wagner.invoke(function(Cita){
		return function(req, res){
			return require('./controllers/appointmentController').getAppointmentsUsedForDate(req, res, Cita);
		}
	}));
	
	api.post('/appointment/', wagner.invoke(function(Cita){
		return function(req, res){
			return require('./controllers/appointmentController').newAppointment(req, res, Cita);
		}
	}));
	
	api.put('/appointment/:_id', wagner.invoke(function(Cita){
		return function(req, res){
			return require('./controllers/appointmentController').updateAppointment(req, res, Cita);
		}
	}));
	
	api.delete('/appointment/:_id', wagner.invoke(function(Cita){
		return function(req, res){
			return require('./controllers/appointmentController').deleteAppointment(req, res, Cita);
		}
	}));
	//end Cita
	
	//region Usuario
	api.get('/user/', wagner.invoke(function(Usuario){
		return function(req, res){
			return require('./controllers/userController').getUsers(req, res, Usuario);
		}
	}));
	
	api.get('/user/:_id', wagner.invoke(function(Usuario){
		return function(req, res){
			return require('./controllers/userController').getUser(req, res, Usuario);
		}
	}));
	
	api.post('/user/', wagner.invoke(function(Usuario){
		return function(req, res){
			return require('./controllers/userController').newUser(req, res, Usuario);
		}
	}));
	
	api.put('/user/:_id', wagner.invoke(function(Usuario){
		return function(req, res){
			return require('./controllers/userController').updateUser(req, res, Usuario);
		}
	}));
	
	api.delete('/user/:_id', wagner.invoke(function(Usuario){
		return function(req, res){
			return require('./controllers/userController').deleteUser(req, res, Usuario);
		}
	}));
	//end Usuario
	return api;
};
