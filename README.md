# Habit Tracker (React)
![Habit Tracker Preview](preview.png)

Aplicación de seguimiento de hábitos desarrollada con **React** como proyecto de aprendizaje.  
Permite crear hábitos, marcar su progreso diario, visualizar rachas y analizar la actividad mediante un calendario mensual y estadísticas.

Este proyecto se creó con el objetivo de practicar **conceptos fundamentales de React**, organización de componentes y gestión de estado en una aplicación real.

---

## Demo

Puedes probar la aplicación aquí:

https://habit-tracker-react-kappa.vercel.app/

---

## Funcionalidades

- Crear y eliminar hábitos (Se ha añadido un segundo botón "ayer" para simular una racha) (También se puede hacer desde el mini calendario)
- Marcar hábitos como completados **hoy o ayer**
- Seguimiento de **racha actual**
- Calendario mensual para visualizar días completados
- Página de **estadísticas y top de rachas**
- Búsqueda y filtrado de hábitos
- Persistencia de datos usando **localStorage**
- Interfaz limpia basada en componentes reutilizables

---

## Tecnologías utilizadas

- **React**
- **Vite**
- **Context API** para gestión de estado global
- **Custom Hooks**
- **CSS Modules**
- **Lucide React** para iconos
- **localStorage** para persistencia de datos

---

## Arquitectura del proyecto

El proyecto está organizado siguiendo una estructura modular:

- **components** → Componentes reutilizables de la interfaz
- **pages** → Páginas principales de la aplicación
- **context** → Gestión de estado global con Context API
- **hooks** → Custom hooks reutilizables
- **utils** → Funciones auxiliares (manejo de fechas, helpers, etc.)

---

## Qué he aprendido con este proyecto

Durante el desarrollo de esta aplicación he trabajado especialmente en:

- Organización de un proyecto React en **componentes reutilizables**
- Gestión de estado global con **Context API**
- Creación y uso de **custom hooks**
- Lógica para calcular rachas de hábitos
- Manejo de fechas y visualización en calendario
- Persistencia de datos en el navegador con **localStorage**
- Mejora de la experiencia de usuario con pequeñas animaciones e interacciones

---

## Instalación

Clonar el repositorio:
git clone https://github.com/PaulaReixach/HabitTrackerReact.git

Instalar dependencias: 
npm install

Ejecutar el servidor de desarrollo:
npm run dev

---

## Posibles mejoras futuras

Algunas ideas para seguir evolucionando el proyecto:

- Página de detalle para cada hábito
- Estadísticas semanales
- Ordenar hábitos manualmente
- Colores personalizados para hábitos
- Modo oscuro
- Sincronización con backend

---

## Autor

Proyecto desarrollado por **Paula Reixach Bonnin** como parte de mi aprendizaje en **React**.

