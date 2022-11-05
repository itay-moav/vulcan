<?php namespace Api;

/**
 * Fetch init data for the dabases selected
 * 
 * @author itay
 *
 */
class DatabaseTablesRead extends \Talis\Chain\aFilteredValidatedChainLink{

    /**
     * 
     * {@inheritDoc}
     * @see \Talis\Chain\aFilteredValidatedChainLink::get_next_bl()
     */
    protected function get_next_bl():array{
        return [
            [\lib\Database\FindConnectionName(),[]],
            [\model\Query\Run::class,['query' => 'SELECT * from INFORMATION_SCHEMA.TABLES']], //fetches all tables in db
            
            
            /* TOBEDELETED
            //Sorts the possible table owners in an easy to use array
            [function (\Talis\Message\Request $Request,\Talis\Message\Response $Response){
                
                $payload = $this->Response->getPayload();
                $table_owners = [];
                foreach($payload->queryResult as $table){
                    $ar_table = (array)$table;
                    $table_owners[$ar_table['TABLE_OWNER']] = $ar_table['TABLE_OWNER'];
                }
                $payload->tablesOwners = array_values($table_owners);
            }
                                                ,[]],
                                                */
            [\Talis\Chain\DoneSuccessfull::class,[]]
        ];
    }
}
