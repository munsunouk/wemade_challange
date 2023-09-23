# 위메이드 과제: BSC 테스트넷 토큰 가격 정보 가져오기 & Send transaction

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Running the Project](#running-the-project)
4. [Usage](#usage)

<a name='prerequisites'></a>
## Prerequisites

- Docker: [Installation guide](https://docs.docker.com/get-docker/)
- Node.js: [Installation guide](https://nodejs.org/en/download/)

<a name='environment-setup'></a>
## 환경설정

    해당 repository 의 root directory 에서 환경 변수를 저장하기 위해 `.env` 파일을 만듭어야 합니다.
    .env 에 대한 예제는 'env_example.env' file 에 있으니 참조하여 만들어야 합니다.


<a name='running-the-project'></a>
### Docker Image 실행
Docker Hub 에서 해당 프로젝트의 Docker 이미지를 가져올 수 있습니다.

1. pull from docker hub

    ```bash
    docker pull munsunouk/wemade_challange:test
    ```

2. Docker 실행:
    ```bash
    docker-compose up
    ```

### repository Installation & Run
해당 repository 를 통해서도 실행하실수 있습니다.

1. Clone this repository:
    ```bash
    git clone https://github.com/munsunouk/wemade_challange.git
    ```

2. Install NPM packages:
    ```bash
    npm install
    npm install pm2 -g
    ```

3. Install NPM packages:
    ```bash
    npm install
    npm install pm2 -g
    ```

4. Compile TypeScript into JavaScript:
    ```bash
    npm run build
    ```

5. Start the application using PM2 :
    ```bash
    pm2 start ./ecosystem.config.js
    ```

<a name='usage'></a>
## Usage
1. 30초 간격으로 저장되는 가격 데이터는 MySQL 해당 데이터테이블 에서 확인하실수 있습니다.

    ```sql
    symbol    | price   | fetchFrom | timestamp
    --------- | ------- | --------- | ----------
    DAI       | 0.9997  | chainlink | 1695299722 
    ETH       | 1587.87 | chainlink | 1695299698 
    USDT      | 1.0008  | bitfinex	| 1695301410 
    USDC     	|	1.0007	|	bitfinex	|	1695301410  
    ETH    	 	|	1589.95	|	bitfinex	|   1695301410
    ```

2. 데이터베이스에 저장된 토큰 가격을 불러오는 API 는 다음과 같이 확인하실수 있습니다.

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

    실행 성공 : 
    Transaction hash:0x6116464c5b58b739a835873f5b5e13e0c9dc7f90280efa1e597f6c9ff4b76b56

    실행 실패 : Failed to donate