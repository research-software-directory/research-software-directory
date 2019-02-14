FROM node:8.11.1 as builder

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN npm run build

FROM nginx:alpine
# The graphs visualization is hosted on the rsd under /graphs/
COPY --from=builder /app/dist /usr/share/nginx/html/graphs
EXPOSE 80
