<?php namespace lib\Database;

abstract class ChainWithConnection extends \Talis\Chain\aChainLink
{
    /**
     * @var iConnection
     */
    protected iConnection $conn;
    
    /**
     *
     * @param \Talis\Message\Request $Request
     * @param \Talis\Message\Response $Response
     * @param array<mixed> $params
     */
    public function __construct(\Talis\Message\Request $Request,\Talis\Message\Response $Response,array $params=[]){
        parent::__construct($Request, $Response,$params);
        $conn = $this->Request->getBodyParam('CONN',null);
        $connection_name = \Talis\Corwin::$Context->resource('connection_name');
        if(!$conn && $connection_name !== \Talis\Context::NaN){ //If there is no connection name setup, I return empty
            if(isset(app_env()['databases'][$connection_name]['user_connection'])){
                $this->conn = app_env()['databases'][$connection_name]['user_connection']($connection_name,app_env()['databases'][$connection_name],\ZimLogger\MainZim::$CurrentLogger);
            } else {
                $this->conn = new Connection($connection_name,app_env()['databases'][$connection_name],\ZimLogger\MainZim::$CurrentLogger);
            }
            $this->Request->addToBodyParams('CONN',$this->conn);
        } elseif($conn) {
            $this->conn = $conn;
        } else{
            throw new \Exception('Missing connection details');
        }
    }
}
