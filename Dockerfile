# syntax=docker/dockerfile:1.3-labs


FROM debian:bookworm AS base

RUN <<EOF
    apt-get update -qq &&
    apt-get upgrade -qq &&
    apt-get install -qq -y --no-install-recommends sqlite3 make
EOF

# setup nodejs
RUN <<EOF
    curl -fsSL https://deb.nodesource.com/setup_23.x | bash -  &&
    apt update &&
    apt install -qq -y nodejs npm &&
    npm install -g pnpm
EOF


# --- image for installing node dependencies ----- #
FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile


# --- image for building app --------------------- #

FROM base AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN make


# --- final image -------------------------------- #

FROM base AS final
WORKDIR /app

LABEL maintainer="anthonypaulfischetti@nypl.org"

ENV TERM=screen-256color
ENV LANG=C.UTF-8
ENV NODE_ENV=production
# ENV SHELL=/usr/bin/zsh

ARG USERNAME=marvin
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# create non-root user
RUN <<EOF
    groupadd --gid $USER_GID $USERNAME &&
    useradd --uid $USER_UID --gid $USER_GID -m $USERNAME
EOF

RUN mkdir .next

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

RUN chown -R $USERNAME:$USERNAME .next

USER $USERNAME
EXPOSE 3000

CMD HOSTNAME="0.0.0.0" node server.js
# CMD bash

