FROM node:lts-buster
RUN git clone https://github.com/mKe-BOY99/MKE-X-MD/root/mKe-BOY99
WORKDIR /root/mKe-BOY99
RUN npm install && npm install -g pm2 || yarn install --network-concurrency 1
COPY . .
EXPOSE 9090
CMD ["npm", "start"]
