FROM ubuntu:22.04

RUN apt update
RUN apt -y upgrade
RUN apt -y install curl git

RUN mkdir -p /usr/local/nvm

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 14.18.2

# Install nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
RUN export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
# Install node 14
RUN [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm install 14
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN mkdir /app
WORKDIR /app
RUN git clone https://github.com/gronblom/assorted-projects.git /tmp/assorted_projects

# Build frontend
RUN cd /tmp/assorted_projects/quiz-app-frontend/ && npm install && npm run build
# Copy frontend build to app dir
RUN cp -r /tmp/assorted_projects/quiz-app-frontend/build /app/public
# Copy simple http-server app for static frontend page
RUN cp /tmp/assorted_projects/aws/quiz-app-ec2/src/http-server/* /app
# Install http-server
RUN npm install

EXPOSE 80

CMD npm start


