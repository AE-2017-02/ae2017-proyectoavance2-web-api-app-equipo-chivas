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
	
	api.get('/activePatient/', wagner.invoke(function(Paciente){
		return function(req, res){
			return require('./controllers/patientController').getActivePatients(req, res, Paciente);
		}
	}));
	
	api.get('/patientPantry/:_id/date/:fecha', wagner.invoke(function(Paciente){
		return function(req, res){
			return require('./controllers/patientController').getPantryMenusForDate(req, res, Paciente);
		}
	}));
	
	api.get('/pantry/:_id/date/:fecha', wagner.invoke(function(Paciente){
		return function(req, res){
			return require('./controllers/patientController').getPantryMenusForDate2(req, res, Paciente);
		}
	}));
	
	api.get('/patient/pendingAmount/', wagner.invoke(function (Paciente, Cita){
		return function(req, res){
			return require('./controllers/patientController').getPatientsWithValidDate(req, res, Paciente, Cita);
		}
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
	
	api.post('/patientPantry/:_id', wagner.invoke(function(Paciente, Comida){
		return function(req, res){
			return require('./controllers/patientController').setPatientPantry(req, res, Paciente, Comida);
		}
	}));
	
	api.post('/patient/activate/:_id', wagner.invoke(function (Paciente){
		return function(req, res){
			return require('./controllers/patientController').sendPatientActivationEmail(req, res, Paciente);
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
	
	api.put('/patientPantry/:_id', wagner.invoke(function(Paciente, Comida){
		return function(req, res){
			return require('./controllers/patientController').removePatientPantry(req, res, Paciente, Comida);
		}
	}));

	//endregion Paciente

	//region Comida
	api.get('/foods/', wagner.invoke(function (Comida, Ingrediente){
		return function(req, res){
			return require('./controllers/foodController').getFoods(req, res, Comida, Ingrediente);
		};
	}));

	api.get('/food/:_id', wagner.invoke(function (Comida){
		return function(req, res){
			return require('./controllers/foodController').getFood(req, res, Comida);
		};
	}));

	api.post('/food/', wagner.invoke(function (Comida, Ingrediente){
		return function(req, res){
			return require('./controllers/foodController').newFood(req, res, Comida, Ingrediente);
		};
	}));
	
	api.put('/food/:_id', wagner.invoke(function(Comida){
		return function(req, res){
			return require('./controllers/foodController').updateFood(req, res, Comida);
		};
	}));

	api.delete('/food/:_id', wagner.invoke(function (Comida, Menu){
		return function(req, res){
			return require('./controllers/foodController').deleteFood(req, res, Comida, Menu);
		};
	}));
	
	//endregion Comida
	
	//RegistroCita
	api.get('/appointmentRegisters/', wagner.invoke(function (RegistroCita){
		return function(req, res){
			return require('./controllers/appointmentRegisterController').getAppointmentRegisters(req, res, RegistroCita);
		};
	}));

	api.get('/appointmentRegister/:_id', wagner.invoke(function (RegistroCita){
		return function(req, res){
			return require('./controllers/appointmentRegisterController').getAppointmentRegister(req, res, RegistroCita);
		};
	}));
	
	api.get('/appointmentRegister/appointment/:_id', wagner.invoke(function(RegistroCita){
		return function(req, res){
			return require('./controllers/appointmentRegisterController').getAppointmentRegisterByAppointment(req, res, RegistroCita);
		};
	}));

	api.get('/getFatMass/:_id', wagner.invoke(function(RegistroCita, Paciente, HistorialCitas){
		return function(req, res){
			return require('./controllers/appointmentRegisterController').getFatMass(req, res, RegistroCita, Paciente, HistorialCitas);
		};
	}));
	
	api.get('/apointmentRegister/firstLast/user/:_id', wagner.invoke(function(RegistroCita, HistorialCitas, Cita){
		return function(req, res){
			return require('./controllers/appointmentRegisterController').getFirstAndLastAppointmentRegisterByPatient(req, res, RegistroCita, HistorialCitas, Cita);
		};
	}));

	api.post('/appointmentRegister/', wagner.invoke(function (RegistroCita){
		return function(req, res){
			return require('./controllers/appointmentRegisterController').newAppointmentRegister(req, res, RegistroCita);
		};
	}));
	
	api.put('/appointmentRegister/:_id', wagner.invoke(function(RegistroCita){
		return function(req, res){
			return require('./controllers/appointmentRegisterController').updateAppointmentRegister(req, res, RegistroCita);
		}
	}));

	api.delete('/appointmentRegister/:_id', wagner.invoke(function (RegistroCita){
		return function(req, res){
			return require('./controllers/appointmentRegisterController').deleteAppointmentRegister(req, res, RegistroCita);
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
	
	api.get('/ingredient/user/:_id', wagner.invoke(function(Ingrediente, Comida, Menu, MenuUsuario, Paciente){
		return function(req, res){
			return require('./controllers/ingredientsController').getIngredientsForUser(req, res, Ingrediente, Paciente, MenuUsuario, Menu, Comida);
		}
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

	api.delete('/ingredient/:_id', wagner.invoke(function (Ingrediente, Comida){
		return function(req, res){
			return require('./controllers/ingredientsController').deleteIngredient(req, res, Ingrediente, Comida);
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
	
	api.get('/menu_user/data/:_id', wagner.invoke(function(MenuUsuario){
		return function(req, res){
			return require('./controllers/menuCompletoController').getMenuUserWithData(req, res, MenuUsuario);
		}
	}));
	
	api.post('/menu_user/', wagner.invoke(function(MenuUsuario){
		return function(req, res){
			return require('./controllers/menuCompletoController').newMenuUser(req, res, MenuUsuario);
		}
	}));

	api.post('/menu_complete/:patient', wagner.invoke(function(MenuUsuario, Menu, Paciente){
		return function(req, res){
			return require('./controllers/menuCompletoController').newMenuUserComplete(req, res, MenuUsuario, Menu, Paciente);
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

	api.get('/appointmentWithUser/', wagner.invoke(function(Cita, Paciente){
		return function(req, res){
			return require('./controllers/appointmentController').getAppointmentsWithPatient(req, res, Cita, Paciente);
		}
	}));	
	
	api.get('/appointmentForDate/:date', wagner.invoke(function(Cita){
		return function(req, res){
			return require('./controllers/appointmentController').getAppointmentsUsedForDate(req, res, Cita);
		}
	}));
	
	api.get('/appointmentLastCompleted/:_id', wagner.invoke(function(Cita, HistorialCitas){
		return function(req, res){
			return require('./controllers/appointmentController').getLastCompletedApointmentForPatient(req, res, Cita, HistorialCitas);
		}
	}));

	api.get('/appointmentRegisteredHistory/:_id', wagner.invoke(function(Cita, HistorialCitas){
		return function(req, res){
			return require('./controllers/appointmentController').getAppointmentRecordForPatient(req, res, HistorialCitas, Cita);
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

	api.post('/user/login/',wagner.invoke(function(Usuario){
		return function(req, res){
			return require('./controllers/userController').getUserByLogin(req, res, Usuario);
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
	
	//region Consultorio
	api.get('/consulterRoom/', wagner.invoke(function(Consultorio){
		return function(req, res){
			return require('./controllers/consulterRoomController').getConsulterRooms(req, res, Consultorio);
		}
	}));
	
	api.get('/consulterRoom/:_id', wagner.invoke(function(Consultorio){
		return function(req, res){
			return require('./controllers/consulterRoomController').getConsulterRoom(req, res, Consultorio);
		}
	}));
	
	api.post('/consulterRoom/', wagner.invoke(function(Consultorio){
		return function(req, res){
			return require('./controllers/consulterRoomController').newConsulterRoom(req, res, Consultorio);
		}
	}));

	
	api.put('/consulterRoom/:_id', wagner.invoke(function(Consultorio){
		return function(req, res){
			return require('./controllers/consulterRoomController').updateConsulterRoom(req, res, Consultorio);
		}
	}));
	
	api.delete('/consulterRoom/:_id', wagner.invoke(function(Consultorio){
		return function(req, res){
			return require('./controllers/consulterRoomController').deleteConsulterRoom(req, res, Consultorio);
		}
	}));
	//end Consultorio
	//region Mensaje
	api.get('/message/', wagner.invoke(function(Mensaje){
		return function(req, res){
			return require('./controllers/messageController').getMessages(req, res, Mensaje);
		}
	}));
	
	api.get('/message/:_id', wagner.invoke(function(Mensaje){
		return function(req, res){
			return require('./controllers/messageController').getMessage(req, res, Mensaje);
		}
	}));

	api.get('/messageByUser/:_id', wagner.invoke(function(Mensaje){
		return function(req, res){
			return require('./controllers/messageController').getMessageByUser(req, res, Mensaje);
		}
	}));
	
	api.get('/generalMessage/', wagner.invoke(function(Mensaje){
		return function(req, res){
			return require('./controllers/messageController').getGeneralMessages(req, res, Mensaje);
		}
	}));
	
	api.post('/message/', wagner.invoke(function(Mensaje){
		return function(req, res){
			return require('./controllers/messageController').newMessage(req, res, Mensaje);
		}
	}));
	
	api.post('/generalMessage/', wagner.invoke(function(Mensaje){
		return function(req, res){
			return require('./controllers/messageController').newGeneralMessage(req, res, Mensaje);
		}
	}));
	
	api.put('/message/:_id', wagner.invoke(function(Mensaje){
		return function(req, res){
			return require('./controllers/appointmentHistoryController').updateMessage(req, res, Mensaje);
		}
	}));
	
	api.delete('/message/:_id', wagner.invoke(function(Mensaje){
		return function(req, res){
			return require('./controllers/appointmentHistoryController').deleteMessage(req, res, Mensaje);
		}
	}));
	//end Mensaje
		//region HistorialCitas
	api.get('/appointmentHistory/', wagner.invoke(function(HistorialCitas){
		return function(req, res){
			return require('./controllers/appointmentHistoryController').getAppointmentHistorys(req, res, HistorialCitas);
		}
	}));
	
	api.get('/appointmentHistory/:_id', wagner.invoke(function(HistorialCitas){
		return function(req, res){
			return require('./controllers/appointmentHistoryController').getAppointmentHistory(req, res, HistorialCitas);
		}
	}));

	api.get('/appointmentHistoryByPatient/:_id', wagner.invoke(function(HistorialCitas){
		return function(req, res){
			return require('./controllers/appointmentHistoryController').getAppointmentHistoryByPatient(req, res, HistorialCitas);
		}
	}));
	
	api.post('/appointmentHistory/', wagner.invoke(function(HistorialCitas){
		return function(req, res){
			return require('./controllers/appointmentHistoryController').newAppointmentHistory(req, res, HistorialCitas);
		}
	}));
	
	api.put('/appointmentHistory/:_id', wagner.invoke(function(HistorialCitas){
		return function(req, res){
			return require('./controllers/appointmentHistoryController').updateAppointmentHistory(req, res, HistorialCitas);
		}
	}));
	
	api.delete('/appointmentHistory/:_id', wagner.invoke(function(HistorialCitas){
		return function(req, res){
			return require('./controllers/appointmentHistoryController').deleteAppointmentHistory(req, res, HistorialCitas);
		}
	}));
	//end HistorialCitas


	//begin GrupoAlimento
		api.get('/foodGroups/',wagner.invoke(function(GrupoAlimento){
			return function(req,res){
				return require('./controllers/foodGroupController').getFoodGroups(req,res,GrupoAlimento);
			}
		}));

		api.get('/foodGroups/:_id',wagner.invoke(function(GrupoAlimento){
			return function(req,res){
				return require('./controllers/foodGroupController').getFoodGroupsById(req,res,GrupoAlimento);
			}
		}));

		api.post('/foodGroups/',wagner.invoke(function(GrupoAlimento){
			return function(req,res){
				return require('./controllers/foodGroupController').newFoodGroup(req,res,GrupoAlimento);
			}
		}));

		api.put('/foodGroups/:_id',wagner.invoke(function(GrupoAlimento){
			return function(req,res){
				return require('./controllers/foodGroupController').updateFoodGroup(req,res,GrupoAlimento);
			}
		}));

		api.delete('/foodGroups/:_id',wagner.invoke(function(GrupoAlimento){
			return function(req,res){
				return require('./controllers/foodGroupController').removeFoodGroup(req,res,GrupoAlimento);
			}
		}));
	//end GrupoAlimento
	return api;
};
