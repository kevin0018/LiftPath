# LiftPath

![Logo](/src/assets/images/logo.png)

## Descripción

LiftPath es una aplicación móvil para seguimiento y planificación de entrenamientos de fitness. Permite a los usuarios registrar su progreso diario, planificar su semana de entrenamiento y gestionar rutinas totalmente personalizadas. La aplicación ofrece un sistema Push-Pull-Legs preconfigurado, pero los usuarios pueden crear sus propios sistemas de entrenamiento según sus preferencias.

## Características principales

- 🔐 **Autenticación de usuarios**: Registro e inicio de sesión con correo electrónico y contraseña
- 💪 **Rutinas personalizables**: Creación de rutinas personalizadas con sistema Push-Pull-Legs preconfigurado opcional
- 📊 **Seguimiento de progreso diario**: Registro de ejercicios completados cada día
- 📅 **Planificación semanal**: Asignación de rutinas para cada día de la semana
- 👤 **Perfil personalizado**: Gestión de información y preferencias del usuario
- 📱 **Diseño responsive**: Experiencia optimizada para dispositivos móviles

## Tecnologías utilizadas

- **React Native**: Framework para desarrollo de aplicaciones móviles
- **Expo**: Plataforma para simplificar el desarrollo de React Native
- **TypeScript**: Lenguaje tipado para mejorar la calidad del código
- **Firebase**: Backend para autenticación y almacenamiento de datos
- **NativeWind/TailwindCSS**: Utilidades CSS para estilizado
- **Expo Router**: Navegación y gestión de rutas en la aplicación

## Instalación

### Requisitos previos

- Node.js (v18 o superior)
- npm o yarn
- Expo CLI
- Cuenta de Firebase (para configuración)

### Pasos de instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/usuario/liftpath.git
cd liftpath
```

2. Instalar dependencias:

```bash
npm install
# o
yarn install
```

3. Configurar Firebase:
   - Crear un proyecto en Firebase Console
   - Habilitar Authentication y Firestore
   - Copiar las credenciales de configuración
   - Actualizar el archivo `src/services/firebaseConfig.ts` con tus credenciales

4. Iniciar la aplicación:

```bash
npx expo start
# o
yarn expo start
```

## Estructura del proyecto

```
src/
  ├── app/                # Rutas de Expo Router
  ├── assets/             # Imágenes, fuentes y recursos estáticos
  ├── components/         # Componentes reutilizables
  ├── constants/          # Constantes y configuración de temas
  ├── context/            # Contextos de React (Auth, etc.)
  ├── navigation/         # Configuración de navegación
  ├── screens/            # Pantallas principales de la aplicación
  ├── services/           # Servicios para conexión con APIs
  ├── styles/             # Estilos globales
  ├── tests/              # Tests unitarios y de integración
  ├── types/              # Definiciones de tipos TypeScript
  └── utils/              # Utilidades y funciones helper
```

## Sistema de entrenamiento personalizable

La aplicación incluye por defecto el sistema de entrenamiento Push-Pull-Legs como opción recomendada:

- **Push (Empuje)**: Ejercicios que involucran empujar peso (pecho, hombros, tríceps)
- **Pull (Jalón)**: Ejercicios que involucran jalar peso (espalda, bíceps)
- **Legs (Piernas)**: Ejercicios enfocados en el tren inferior (cuádriceps, isquiotibiales, pantorrillas)

Este sistema permite una recuperación adecuada mientras se entrena con suficiente frecuencia para maximizar resultados.

Sin embargo, LiftPath es totalmente personalizable y permite a los usuarios:
- Crear sus propias rutinas desde cero
- Adaptar rutinas existentes a sus necesidades
- Organizar ejercicios según diferentes metodologías de entrenamiento
- Establecer su propia frecuencia y división de entrenamiento semanal

## Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está disponible como software de código abierto bajo la licencia GNU General Public License v3.0 (GPL-3.0). Esto significa que puedes:

- Usar el software para cualquier propósito
- Cambiar el software para adaptarlo a tus necesidades
- Compartir el software con tus amigos y compañeros
- Compartir los cambios que hagas

Para más información sobre la licencia GPL-3.0, consulta [https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html).

## Autor

Desarrollado por [kevin0018](https://github.com/kevin0018)
