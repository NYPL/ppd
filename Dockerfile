# syntax=docker/dockerfile:1.3-labs

#  TODO  use a multi-stage build

FROM debian:bookworm

LABEL maintainer="anthonypaulfischetti@nypl.org"

ENV TERM=screen-256color
ENV LANG=C.UTF-8
# ENV SHELL=/usr/bin/zsh

ARG USERNAME=marvin
ARG USER_UID=1000
ARG USER_GID=$USER_UID


RUN <<EOF
    apt-get update -qq &&
    apt-get upgrade -qq &&
    apt-get install -qq -y --no-install-recommends sqlite3 make awscli
EOF

# create non-root user
RUN <<EOF
    groupadd --gid $USER_GID $USERNAME &&
    useradd --uid $USER_UID --gid $USER_GID -m $USERNAME
EOF

WORKDIR /app

# setup nodejs
RUN <<EOF
    curl -fsSL https://deb.nodesource.com/setup_23.x | bash -  &&
    apt update &&
    apt install -qq -y nodejs npm &&
    npm install -g pnpm
EOF


COPY . .
#  TODO  technically, I should bring over pnpm-lock.yaml, too ...
RUN pnpm i

ENV NODE_ENV=production

RUN --mount=type=secret,id=aws,target=/root/.aws/credentials make

USER $USERNAME
EXPOSE 3000

# CMD bash
CMD HOSTNAME="0.0.0.0" npm run startstandalone

