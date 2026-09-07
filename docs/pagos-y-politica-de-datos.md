# Consultas, Wompi y política de datos

Implementación del 7 de septiembre de 2026 a partir de los precios, enlace y documento facilitados por el usuario y Angie.

Las tarifas están centralizadas en `src/lib/consultation-payments.ts`: valoración presencial, $70.000 habitual y $50.000 en línea; consulta virtual, $50.000 habitual y $35.000 en línea. No se publican precios de procedimientos. Los servicios seleccionables y los horarios continúan viniendo de la API.

El enlace se ofrece después de que la API devuelve un registro exitoso con código de confirmación, únicamente para `valoracion-presencial` y `consulta-virtual`. Si solo se recibió una solicitud sin horario, se pide coordinar antes de pagar. El enlace abre otra pestaña y no altera el estado de pago de la cita. El equipo debe verificar el comprobante; esta integración no concilia transacciones automáticamente.

Se verificó en el navegador que el enlace identifica al comercio como Coisalud Laser y pide al pagador ingresar el valor. No se añadieron parámetros no documentados. Para automatizar el importe posteriormente, configurar enlaces de importe fijo por modalidad o integrar Checkout con las credenciales y firma correspondientes.

Documentación consultada:

- https://docs.wompi.co/docs/colombia/links-de-pago/
- https://docs.wompi.co/docs/colombia/widget-checkout-web/
- https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981
- https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/decreto_1074_2015_pr025.htm
- https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/resolucion-839-de-2017.pdf

La política conserva los nombres y canales de contacto del documento recibido y amplía finalidades, derechos, procedimientos, menores, datos sensibles, proveedores, conservación y vigencia. No se inventaron NIT ni razón social. La identidad jurídica exacta del responsable y la ejecución de las obligaciones descritas deben validarse con el consultorio; el texto no sustituye esa validación ni una revisión jurídica.

Verificación: TypeScript y ESLint; renderizado del componente de pago para ambas tarifas, ausencia de enlace antes del éxito, servicio sin tarifa, solicitud sin horario y advertencia de pago no verificado; página de política revisada en navegador. No se enviaron citas ni pagos reales. El catálogo del servidor local observado no incluía las dos modalidades, por lo que no se probó una reserva completa contra ese servidor.
