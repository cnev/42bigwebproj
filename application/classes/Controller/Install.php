<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Install extends Controller_Template {

	public $template = 'site';

	public function action_index()
	{
		$this->template->data['news'] = $this->install->loadFirstPageNews(30);

	}
}
