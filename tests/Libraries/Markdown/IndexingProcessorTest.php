<?php

/**
 *    Copyright (c) ppy Pty Ltd <contact@ppy.sh>.
 *
 *    This file is part of osu!web. osu!web is distributed with the hope of
 *    attracting more community contributions to the core ecosystem of osu!.
 *
 *    osu!web is free software: you can redistribute it and/or modify
 *    it under the terms of the Affero GNU General Public License version 3
 *    as published by the Free Software Foundation.
 *
 *    osu!web is distributed WITHOUT ANY WARRANTY; without even the implied
 *    warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *    See the GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with osu!web.  If not, see <http://www.gnu.org/licenses/>.
 */
use App\Libraries\Markdown\Indexing\IndexingProcessor;

class IndexingProcessorTest extends TestCase
{
    public function testAll()
    {
        $path = __DIR__.'/markdown_examples';

        foreach (glob("{$path}/*.md") as $mdFilePath) {
            $markdown = file_get_contents($mdFilePath);
            $textFilePath = preg_replace('/\.md$/', '.txt', $mdFilePath);

            $output = IndexingProcessor::process($markdown);
            $referenceOutput = file_get_contents($textFilePath);

            $this->assertSame($referenceOutput, $output);
        }
    }
}
