FROM node:12-slim

RUN apt-get -y update
RUN apt-get -y install git
#TODO: the user permission is what is not working here
#which one of these will work? Test both.
USER root
RUN sudo su

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN npm i puppeteer puppeteer-extra \
    # Add user so we don't need --no-sandbox.
    # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /node_modules

RUN npm install express
RUN npm install @postlight/mercury-parser
RUN npm install nodemailer
RUN npm install util
RUN npm install handlebars
RUN npm install uuid
RUN npm install dotenv
RUN npm install node-cron

USER pptruser

COPY . .
EXPOSE 3006
CMD ["npm", "start"]