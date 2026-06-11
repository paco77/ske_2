# Guía de Despliegue con CloudPanel en DigitalOcean

Esta guía te llevará paso a paso para configurar tu propio servidor capaz de alojar múltiples proyectos de Laravel usando **CloudPanel** de forma gratuita.

---

## Fase 1: Creación del Servidor (Droplet)

1. Inicia sesión en tu cuenta de [DigitalOcean](https://cloud.digitalocean.com/).
2. Haz clic en el botón verde **"Create"** (arriba a la derecha) y selecciona **"Droplets"**.
3. En la sección **"Choose an image"** (Elegir una imagen), haz clic en la pestaña **"Marketplace"**.
4. En el buscador escribe **"CloudPanel"** y selecciónalo (usualmente basado en Ubuntu 22.04).
5. En **"Choose Size"**, la opción básica **"Regular"** de **$6/mes** (1GB RAM) es perfecta para empezar.
6. En **"Choose Authentication Method"**, crea una contraseña segura (anótala bien) o usa tus llaves SSH.
7. Haz clic en **"Create Droplet"**. Espera unos minutos a que se instale y te asigne una **Dirección IP Pública**.

---

## Fase 2: Configuración Inicial de CloudPanel

1. Una vez creado el Droplet, copia su dirección IP.
2. En tu navegador, ingresa a: `https://TU-IP:8443`
   > [!WARNING]
   > Tu navegador te dirá que "La conexión no es privada" porque el certificado es autofirmado. Haz clic en **"Configuración Avanzada"** y luego en **"Acceder de todos modos"**.
3. Verás la pantalla de bienvenida de CloudPanel. Llena el formulario para crear tu usuario administrador, contraseña y zona horaria.
4. Inicia sesión con tus nuevas credenciales.

---

## Fase 3: Agregar tu Proyecto Laravel

Dentro de CloudPanel, vamos a crear el "espacio" para tu proyecto:

1. En el menú de CloudPanel, haz clic en **"Sites"** (Sitios) y luego en **"Add Site"** (Añadir Sitio).
2. Selecciona **"Create a PHP Site"**.
3. Llena los datos:
   - **Domain Name:** Ingresa tu dominio (ej. `midominio.com`). *Nota: Debes apuntar los DNS de tu dominio a la IP del servidor en tu proveedor de dominio.*
   - **Document Root:** Muy importante para Laravel. Escribe: `htdocs/midominio.com/public` *(Reemplaza "midominio.com" con el tuyo).*
   - **PHP Version:** Selecciona PHP 8.2 o superior.
   - **Vhost Template:** Selecciona "Laravel".
4. Haz clic en **Create**.

---

## Fase 4: Base de Datos

1. En el menú izquierdo de CloudPanel, ve a **"Databases"**.
2. Haz clic en **"Add Database"**.
3. Ponle un nombre a la base de datos, un nombre de usuario y genera una contraseña segura.
4. **Guarda estos 3 datos** (Nombre, Usuario y Contraseña), los necesitarás para el archivo `.env` de Laravel.

---

## Fase 5: Subir el Código al Servidor

Tienes dos opciones: por SFTP (como FileZilla) o por Consola (Git). Te recomiendo **Git** porque es más rápido para actualizar en el futuro:

1. En CloudPanel, ve a tu sitio y busca la pestaña **"SSH/SFTP"**.
2. Añade un usuario SSH y conéctate por consola usando ese usuario (o usa la terminal integrada en la web si está disponible).
3. Navega a la carpeta de tu sitio:
   ```bash
   cd htdocs/midominio.com
   ```
4. Borra la carpeta vacía por defecto y clona tu repositorio:
   ```bash
   rm -rf *
   git clone https://github.com/TU-USUARIO/TU-REPO.git .
   ```

---

## Fase 6: Configurar Laravel y React

Una vez que tu código esté en el servidor, ejecuta los comandos mágicos de instalación:

1. **Instalar dependencias de PHP:**
   ```bash
   composer install --optimize-autoloader --no-dev
   ```
2. **Crear el archivo `.env`:**
   ```bash
   cp .env.example .env
   ```
3. **Editar el `.env`:** *(Usa el comando `nano .env`)*
   - Pon la conexión a la base de datos que creaste en la Fase 4.
   - Cambia `APP_ENV=production` y `APP_DEBUG=false`.
   - Cambia `APP_URL=https://midominio.com`.
4. **Generar la llave de la app:**
   ```bash
   php artisan key:generate
   ```
5. **Migrar la base de datos:**
   ```bash
   php artisan migrate --force
   ```
6. **Enlazar las imágenes (Storage):**
   ```bash
   php artisan storage:link
   ```
7. **Instalar y compilar React (Vite):**
   ```bash
   npm install
   npm run build
   ```

> [!TIP]
> En la pestaña **"SSL/TLS"** de CloudPanel, puedes hacer clic en **"New Let's Encrypt Certificate"** para ponerle el candado verde de seguridad HTTPS a tu página con un solo clic (es 100% gratis).

¡Listo! Si vas a `midominio.com`, tu sistema estará funcionando en producción. Para agregar más proyectos en el futuro, solo repites desde la **Fase 3** usando otro dominio.
