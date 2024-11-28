// Indices de Sheet Capacity
const SHEET_COLABORADOR_REGISTRO_IDX = 6;
const SHEET_COLABORADOR_NOMBRES_APELLIDOS_IDX = 7;
const SHEET_COLABORADOR_NOMBRES_LIDER_IDX = 9;
const SHEET_COLABORADOR_EMAIL_LIDER_IDX = 10;
const SHEET_COLABORADOR_CENTRO_COSTOS_IDX = 26;
const SHEET_COLABORADOR_CENTRO_NOMBRE_COSTOS_IDX = 27;
const SHEET_CAPACITY_NOMBRE_PREFERIDO_IDX = 89;


// Indices Sheet Maternidad
const SHEET_MATERNIDAD_REGISTRO_IDX = 2;
const FORM_DATOS_NOMBRE_IDX = 3;
const FORM_DATOS_FECHA_PARTO_IDX = 5;
const FORM_DATOS_EDAD_GESTACIONAL_IDX = 6;
const SHEET_DATOS_EMAIL_IDX = 7;
const FORM_DATOS_SUSTENTO_MEDICO_IDX = 8;
const FORM_DATOS_FECHA_RETORNO_IDX = 25;

//Indices Sheet Logs
const SHEET_LOGS_MARCA_TEMPORAL_IDX = 0;
const SHEET_LOGS_PREGISTRO_IDX = 1;
const SHEET_LOGS_CORREO_IDX = 2;
const SHEET_LOGS_TIPOENVIO_IDX = 3;

// Indices Sheet Maternidad Reingreso
const SHEET_MATERNIDAD_REGISTRO_REINGRESO_IDX = 3;
const FORM_DATOS_NOMBRE_REINGRESOIDX = 4;
const FORM_DATOS_FECHA_REINGRESO_IDX = 1;

// Indices Sheet Subsidios
const SHEET_SUBSIDIO_REGISTRO_IDX = 0;
const SHEET_SUBSIDIO_FECHA_FIN_IDX = 10;

// Datos de correo
const MAIL_SENDER_NAME = "BBVA - Bienestar Peru";
const MAIL_SENDER_NAME_SUBSIDIO = "BBVA - Subsidios Peru";
const MAIL_SENDER_EMAIL = "";
const MAIL_SENDER_EMAIL_SUBSIDIO = "";

//CORREOS IMAGEN
const CARPETA_ID = "";
const IMAGEN_SUBSIDIO_RECORDATORIO = "Copia de Subsidio.jpg";
const IMAGEN_BIENVENIDA_GUIA = "Copia de Guia.jpg";
const IMAGEN_BIENVENIDA_MADRE_A_MANAGER = "Copia de Guía Manager Madre.jpg";
const IMAGEN_REINGRESO_COLABORADORA = "Reingreso Madre.jpg";
const IMAGEN_REINGRESO_MANAGER_COLABORADORA = "Reingreso Madre Manager.jpg";
const IMAGEN_RECORDATORIO_REGISTRAR_FECHA = "Aviso Regreso Madre.jpg";

//TIPO CORREO
const TIPO_RECORDATORIO_LICENCIA = "Recordatorio subsidio";
const TIPO_INICIO_MATERNIDAD = "Inicio Maternidad";
const TIPO_REINGRESO_MATERNIDAD = "Reingreso Maternidad";
const TIPO_RECORDATORIOA_LLENAR_FECHA_REGRESO = "Recordatorio Llena Fecha Regreso";


function obtenerImagenDrive(nombreArchivo) {
  var archivo;
  var carpetas = DriveApp.getFolderById(CARPETA_ID);
  var archivos = carpetas.getFilesByName(nombreArchivo);
  while (archivos.hasNext()) {
    archivo = archivos.next().getAs("image/jpeg");
  }

  return archivo;
}

function convertirNombreAPrimeroMayuscula(nombreAConvertir){
  var nombreFinalArray = nombreAConvertir.split(" ");
  var nombreFinal = primeraLetraMayuscula(nombreFinalArray[0]);
  for (var i = 1; i < nombreFinalArray.length; i++) {
    nombreFinal = nombreFinal + ' ' + primeraLetraMayuscula(nombreFinalArray[i]);
  }
  return nombreFinal;
}

function primeraLetraMayuscula(cadena) {
  var nuevaCadena = '';
  if (cadena != '') {
    var primeraLetra = cadena[0].toUpperCase();
    var ultimasLetras = cadena.substring(1).toLowerCase();

    nuevaCadena = primeraLetra + ultimasLetras;
  }

  return nuevaCadena;
}


function quitarLetraDePregistro(codigo) {
  if (codigo && codigo.length > 0) {
    return '0' + codigo.slice(1);
  }
  return codigo;
}


function guardarLog(registroColaborador,emailColaborador,tipoEnvio){
  console.log("en guardarLog:: " + registroColaborador + emailColaborador + tipoEnvio);

  var ultimaFila = SHEET_LOGS.getLastRow();
  var marcaTemporal = new Date();
  var datosLog = [marcaTemporal,registroColaborador,emailColaborador,tipoEnvio];
  SHEET_LOGS.getRange(ultimaFila + 1, SHEET_LOGS_MARCA_TEMPORAL_IDX + 1, 1, 4).setValues([datosLog]);

}
