<?php
  /* Script  : js_in_header.php
   * Author  : M McIntyre
   * Created : 19 October 2016
   * Purpose : Generates javascript to be included in the head section
   *           Remember that the jQuery library is automatically loaded in the admin header template
   */

		if ( isset($scripts ) )
		{
			foreach ( $scripts as $javascript_script )
			{
				$need_src = true ;
				$output = '<script';
				if ( array_key_exists('parameters', $javascript_script) )
				{
					foreach ( $javascript_script['parameters'] as $name => $value )
					{
						if ( $value !== false )
						{
							$output .= ' ' . $name ;
							if ( $value !== true )
							{
								$output .= '="' . $value . '"' ;
							}
						}
						$need_src = $need_src && $name != 'src' ;
					}
				}
				if ( $need_src )
				{
					$output .= ' src="' . $javascript_script['src'] . '"' ;
				}
                $output .= '></script>' ;
                echo $output . PHP_EOL ;
          }
			
		}
		if ( isset($raw) )
		{
          echo '<!-- custom javascript -->' . PHP_EOL . '<script type="text/javascript">' . PHP_EOL ;
          foreach ( $raw as $js )
          {
            echo $js . PHP_EOL ;
          }
          echo '</script>' . PHP_EOL ;
		}

?>
