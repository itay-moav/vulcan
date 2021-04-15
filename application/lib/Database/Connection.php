<?php

namespace lib\Database;

class Connection{

    /**
     *
     * @var \ZimLogger\Streams\aLogStream
     */
    private \ZimLogger\Streams\aLogStream $Logger;

    /**
     * Native DB class.
     * Most likely PDO
     *
     * @var \PDO
     */
    private \PDO $NativeDB;

    /**
     * Last SQL which has been performed
     *
     * @var String
     */
    private string $lastSql = '';

    /**
     * Holds the last PDO Statment object
     *
     * @var \PDOStatement
     */
    private \PDOStatement $lastStatement;

    /**
     * Array of Parameters last used in the last SQL
     *
     * @var string[]
     */
    private array $lastBindParams = [];

    /**
     * Number of the rows returned or affected
     *
     * @var Int
     */
    public int $numRows = 0;

    /**
     * Number of fields in returned rowset
     *
     * @var Int
     */
    public int $numFields = 0;

    /**
     * Holds the last inserted ID
     *
     * @var string
     */
    public string $lastInsertID = '';

    /**
     * Wether to execute the query or not.
     * Good to get back the SQL only, for Pagers, for example.
     */
    private bool $noExecute = false;

    /**
     * Give a name to the connection so we can register/unregister in the factory
     * Helpfull for debugging all active connections
     */
    private string $connection_name = '';

    /**
     * last error code caught with no fail on error
     * When false, no error was caught
     *
     * @var integer
     */
    public int $lastErrorCode = -1;

    /**
     * Creating an instance
     * Although this is a type of sigleton, we are using a public modifier here, as we inherit the PDO class
     * which have a public constructor.
     * 
     * @param string $connection_name
     * @param array<string, string> $conf_data
     * @param \ZimLogger\Streams\aLogStream $Logger
     */
    public function __construct(string $connection_name, array $conf_data, \ZimLogger\Streams\aLogStream $Logger)
    {
        $this->Logger = $Logger;
        $this->connection_name = $connection_name;
        $dns = "sqlsrv:server = tcp:{$conf_data['server']},{$conf_data ['port']}; Database = {$conf_data ['database']}";
        $this->NativeDB = new \PDO($dns,"{$conf_data ['username']}", "{$conf_data ['password']}");
        $this->NativeDB->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->Logger->debug("Connect to [{$dns}]");
    }
   
    /**
     * @param string $sql
     * @param array<string,string> $params
     * @throws \PDOException
     * @return Connection
     */
    public function execute(string $sql, array $params = []): Connection
    {
        $this->lastSql = $sql;
        $this->lastBindParams = $params;
        $this->Logger->debug($this->getDebugInfo());
        if ($this->noExecute)
            return $this;

        $DB = $this->NativeDB;

        if ($params) {
            $this->lastStatement = $DB->prepare($sql);
            $query = $this->lastStatement->execute($params);
            $error = $this->lastStatement->errorInfo();
        } else {
            $query = $DB->query($sql);
            if($query) $this->lastStatement = $query;
            $error = $DB->errorInfo();
        }

        if ($error[0] != '0000' || !$query) {
            $this->Logger->fatal("Query failed [{$sql}]", false);
            $this->Logger->fatal($error, false);
            throw new \Exception(print_r($error,true));
        }

        $this->numFields = $this->lastStatement->columnCount();
        $this->numRows   = $this->lastStatement->rowCount();
        $this->lastInsertID = $this->NativeDB->lastInsertId();
        $this->Logger->debug("NUMFIELDS: [{$this->numFields}]\nNUMROWS: [{$this->numRows}]");
        return $this;
    }

    /**
     * Returns the last statement Object
     *
     * @return \PDOStatement
     */
    public function getLastStatement(): \PDOStatement
    {
        return $this->lastStatement;
    }

    /**
     * Returns the last SQL
     *
     * @return String
     */
    public function getLastSql(): string
    {
        return $this->lastSql;
    }

    /**
     * Returns the last bind valye array
     *
     * @return string[]
     */
    public function getLastbindParams(): array
    {
        return $this->lastBindParams;
    }

    /**
     * Fetch the rowset based on the PDO Type (FETCH_ASSOC,...)
     *
     * @param integer $fetch_type
     * @return array<string, string>
     */
    public function fetchAll(int $fetch_type = \PDO::FETCH_ASSOC): array
    {
        $res = $this->lastStatement->fetchAll($fetch_type);
        return $res ?: [];
    }

    /**
     * Fetch the rowset based on the PDO Type (FETCH_OBJ)
     *
     * @return \stdClass[]
     */
    public function fetchAllObj(): array
    {
        $res = $this->lastStatement->fetchAll(\PDO::FETCH_OBJ);
        if($res === false){
            throw new \Exception('Failed retrieving results - add logs to debug');
        }
        return $res;
    }

    /**
     * 
     * @param string $class_name
     * @param array $ctor_args
     * @throws \Exception
     * @return \stdClass[]
     */
    public function fetchAllUserObj(string $class_name, array $ctor_args = []): array
    {
        $res = $this->lastStatement->fetchAll(\PDO::FETCH_CLASS, $class_name, $ctor_args);
        if($res === false){
            throw new \Exception('Failed retrieving results - add logs to debug');
        }
        return $res;
    }

    /**
     * 
     * @param callable $func
     * @return array<int,mixed>
     */
    public function fetchAllUserFunc($func): array
    {
        $res = $this->lastStatement->fetchAll(\PDO::FETCH_FUNC, $func);
        if($res === false){
            throw new \Exception('Failed retrieving results - add logs to debug');
        }
        return $res;
    }

    /**
     * returns the result index by the first selected field and an array of the
     * rest of the columns
     *
     * @param callable $func
     * @return array<int,mixed>
     */
    public function fetchAllIndexed(callable $func): array
    { // THIS IS STILL THOUGHT UPON!
        $res=$this->lastStatement->fetchAll(\PDO::FETCH_UNIQUE | \PDO::FETCH_FUNC, $func);
        if($res === false){
            throw new \Exception('Failed retrieving results - add logs to debug');
        }
        return $res;
    }

    /**
     * Returns array structured [f1=>f2,f1=>f2,f1=>f2 ...
     * f1=>f2]
     *
     * @return array
     */
    public function fetchAllPaired(): array
    {
        return $this->lastStatement->fetchAll(\PDO::FETCH_KEY_PAIR);
    }

    /**
     * Fetches one column as an array
     *
     * @param int $column
     *            index in select list
     * @return array
     */
    public function fetchAllColumn(int $column = 0): array
    {
        return $this->lastStatement->fetchAll(\PDO::FETCH_COLUMN, $column);
    }

    private function fetchRow($result_type)
    {
        return $this->lastStatement ? $this->lastStatement->fetch($result_type) : null;
    }

    public function fetchNumericArray(): array
    {
        return $this->fetchRow(\PDO::FETCH_NUM);
    }

    public function fetchArray(): array
    {
        return $this->fetchRow(\PDO::FETCH_ASSOC);
    }

    public function fetchObj()
    {
        return $this->fetchRow(\PDO::FETCH_OBJ);
    }

    /**
     * Debug info for who ever wants it
     *
     * @return string
     */
    public function getDebugInfo(): string
    {
        return "LAST SQL: \n{$this->lastSql}\nWith params:\n\n" . print_r($this->lastBindParams, true);
    }
}
    
    