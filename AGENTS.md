# Instrucciones para Agentes (AI Instructions)

## Strict TypeScript
* Es **obligatorio** el tipado estricto para las propiedades (props) y retornos de las funciones y componentes.
* Queda **absolutamente prohibido** el uso de `any`.

## Exports
* Todos los componentes DEBEN usar `export default`.

## Styling
* Se deben utilizar ÚNICAMENTE clases de utilidad de **Tailwind CSS**. 
* No se deben crear archivos CSS adicionales para dar estilo.

## Regla de Documentación (Documentation Rule)
Todo nuevo código o cambio en la arquitectura debe estar documentado en `/docs/*` y debe responder obligatoriamente a las siguientes preguntas:
1. **¿Qué se hizo?** (What?)
2. **¿Por qué se hizo?** (Why?)
3. **¿Para qué sirve?** (What for?)
4. **¿Dónde está implementado?** (Where?)
5. **¿Cómo funciona?** (How?)
