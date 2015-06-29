<?php
/**
 * Description of news
 *
 * @author aquilax
 */
class Model_Install extends Model
{
	public function loadFirstPageNews($n)
	{
		return DB::select('id', 'title', 'user_id', 'user_name', 'comments', 'points', new Database_Expression('UNIX_TIMESTAMP(created) AS created'))
		->from('news')
		->order_by(new DatabaseExpression('(points - 1) / ((UNIX_TIMESTAMP(CURRENT_TIMESTAMP)-UNIX_TIMESTAMP(created))/3600 +2)^1.5'), 'DESC')
		->order_by('created')
		->limit($n)
		->execute()
		->as_array();
	}
}
?>



