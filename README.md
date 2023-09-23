# 위메이드 과제: BSC 테스트넷 토큰 가격 정보 가져오기 & Send transaction

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
4. [Usage](#usage)
5. [Repository](#repository)

<a name='prerequisites'></a>
## Prerequisites

- Docker: [Installation guide](https://docs.docker.com/get-docker/)
- Node.js: [Installation guide](https://nodejs.org/en/download/)

<a name='environment-setup'></a>
## 환경설정

### Docker Image 실행
Docker Hub 에서 해당 프로젝트의 Docker 이미지를 가져올 수 있습니다.

1. pull from docker hub

    ```bash
    docker pull munsunouk/wemade_challange:test
    ```

2. Docker 실행
    ```bash
    docker run -d --name wemade_challenge_container munsunouk/wemade_challange:test
    ```

3. Docker shell 접속
    ```bash
    docker exec -it wemade_challenge_container /bin/bash
    ```

### repository Installation
해당 repository 를 통해서도 설치하실수 있습니다.

1. Clone this repository:
    ```bash
    git clone https://github.com/munsunouk/wemade_challange.git
    ```

2. Install NPM packages:
    ```bash
    npm install
    npm install pm2 -g
    ```

3. Compile TypeScript into JavaScript:
    ```bash
    npm run build
    ```

<a name='usage'></a>
## Usage
    
1. 30초 간격으로 저장되는 가격 데이터는 MySQL 해당 데이터테이블 에서 확인하실수 있습니다.
    
    ```bash
    pm2 start dist/run/app.js --name "app"
    ```

    | symbol | price   | fetchFrom | timestamp |
    | ------ | ------- | --------- | --------- |
    | DAI    | 0.9997  | chainlink | 1695299722 |
    | ETH    | 1587.87 | chainlink | 1695299698 |
    | USDT   | 1.0008  | bitfinex  | 1695301410 |
    | USDC   | 1.0007  | bitfinex  | 1695301410 |
    | ETH    | 1589.95 | bitfinex  | 1695301410 |

2. 데이터베이스에 저장된 토큰 가격을 불러오는 API 는 다음과 같이 확인하실수 있습니다.

    ```bash
    pm2 start dist/run/api.js --name "api"
    ```

    GET http://localhost:3000/token-info

    #### Parameters:

    | Name | Type | Mandatory | Description |
    | ---- | ---- | --------- | ----------- |
    | `tokenSymbol` | STRING 	| YES 	| - |
    | `source`     	| STRING 	| NO  	| Source where price was fetched from. |
    | `startTime`  	| LONG   	| NO  	| Timestamp in milliseconds to get data from (inclusive). |
    | `endTime`    	| LONG   	| NO  	|int Timestamp in milliseconds to get data until (inclusive). |

    Response :

    example http://localhost:3000/token-info?tokenSymbol=DAI

    ```json
    [
        {
            "symbol" : "DAI",
            "price" : "0.9997",
            "fetchFrom" : "chainlink",
            "timestamp" : "1695299722",
        }
    ]
    ```

3. Donate 실행 결과는 다음과 같이 확인하실수 있습니다.

    ```bash
    pm2 start dist/run/donate.js --privateKey=0x~ --amount=0.01 --name "donate"
    ```

    실행 성공 : Transaction hash:0x6116464c5b58b739a835873f5b5e13e0c9dc7f90280efa1e597f6c9ff4b76b56

    실행 실패 : Failed to donate


<a name='repository'></a>
## Repository

    ```
    📦 assign
    ├─ .gitignore
    ├─ abis
    │  ├─ Assignment_abi.json
    │  └─ ChainLinkOracle_abi.json
    ├─ docker-compose.yml
    ├─ dockerfile
    ├─ package-lock.json
    ├─ package.json
    ├─ run
    │  ├─ api.ts
    │  ├─ app.ts
    │  └─ donate.ts
    ├─ src
    │  ├─ fetchBitfinex.ts
    │  ├─ fetchChainlink.ts
    │  ├─ routeApi.ts
    │  ├─ routeSql.ts
    │  ├─ sendDonate.ts
    │  └─ utils.ts
    └─ tsconfig.json
    ```