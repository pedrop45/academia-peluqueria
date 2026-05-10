<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\TeamMember;
class TeamController extends Controller
{
    public function index()
    {
        return response()->json(
            TeamMember::where('active', true)->orderBy('order')->get()
        );
    }
}
