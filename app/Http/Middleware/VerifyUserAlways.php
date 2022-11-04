<?php

// Copyright (c) ppy Pty Ltd <contact@ppy.sh>. Licensed under the GNU Affero General Public License v3.0.
// See the LICENCE file in the repository root for full licence text.

namespace App\Http\Middleware;

class VerifyUserAlways extends VerifyUser
{
    public static function isRequired($user)
    {
        return $user !== null && ($user->isPrivileged() || $user->isInactive());
    }

    public function requiresVerification($request)
    {
        if ($this->user === null) {
            return false;
        }

        $method = $request->getMethod();
        $isPostAction = config('osu.user.post_action_verification')
            ? !in_array($method, ['GET', 'HEAD', 'OPTIONS'], true)
            : false;

        $isRequired = $isPostAction || $method === 'DELETE' || session()->get('requires_verification');

        return $isRequired;
    }
}
