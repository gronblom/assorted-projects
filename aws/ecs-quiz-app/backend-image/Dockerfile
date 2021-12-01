FROM ubuntu:22.04

RUN apt update
RUN apt -y upgrade
RUN apt -y install curl git

# nvm env
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

# Build backend
RUN cp -r /tmp/assorted_projects/quiz-app-backend/* /app
RUN npm install
RUN npm run tsc
RUN cp -r src/graphql/schemas build/graphql/

EXPOSE 4000

CMD npm start
