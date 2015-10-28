var ANIM_WALK_RIGHT = 0;
var ANIM_IDLE_RIGHT = 1;
var ANIM_DEATH_RIGHT = 2;
var ANIM_JUMP_RIGHT = 3;

var ANIM_MAX = 4;

var Player = function() 
{
	this.sprite = new Sprite("skeleton.png");
	this.sprite.buildAnimation(5, 4, 36, 48, 0.1,[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
	this.sprite.buildAnimation(5, 4, 36, 48, 0.1,[11, 12, 13, 14]);
	this.sprite.buildAnimation(5, 4, 36, 48, 0.25,[15, 16, 17, 18, 19]);
	this.sprite.buildAnimation(5, 4, 36, 48, 0.1, [0]);
	
	for(var i=0; i<ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, 5, 5);
	}	
	
	
	this.width = 36;
	this.height = 48;
	
	this.position = new Vector2(10, 400);
	this.position.set(100, 400);
	
	this.shootTimer = 0;
	
	this.velocity = new Vector2(0, 0);
		
	this.falling = true;
	this.jumping = false;
	this.dead = false;
	this.score = 0;
	this.lives = 3;
	this.sprite.setAnimation(ANIM_WALK_RIGHT);
	
	
	this.speed = 1;
	this.distance = 0;
	
	//TODO score system
	this.score = 0;
	this.dead = false;
	};
	
	
Player.prototype.update = function(deltaTime)
{
	switch(this.dead)
	{
		case true:
			if (this.sprite.currentAnimation != ANIM_DEATH_RIGHT)
			this.sprite.setAnimation(ANIM_DEATH_RIGHT);
		break;
		
		case false:
	
	this.speed = 1;
	
	
	
	// sets animation back to walk if nothing special is happening. ie: player just jumped and no buttons pressed.
	if (this.sprite.currentAnimation != ANIM_WALK_RIGHT  && !this.falling && !this.jumping)
	{
		this.sprite.setAnimation(ANIM_WALK_RIGHT);
	}

		
	var left = false;
	var right = false;
	var jump = false;
	//right = true;
	
	// player is always going right in our game.
	
	
	if (this.dead == true)
	{
		
	}
	else
	{
		var right = true
	}
	if (keyboard.isKeyDown(keyboard.KEY_RIGHT) == true && !this.falling && !this.dead)
	{
		this.speed *= 1.25;
	}

	else if (keyboard.isKeyDown(keyboard.KEY_LEFT) == true )
	{
		this.speed = 0;
		if (this.sprite.currentAnimation != ANIM_IDLE_RIGHT && !this.falling && !this.jumping)
		{
			this.sprite.setAnimation(ANIM_IDLE_RIGHT)
		}
	}
	
	else if (this.sprite.currentAnimation != ANIM_WALK_RIGHT  && !this.falling && !this.jumping)
	{
		this.sprite.setAnimation(ANIM_WALK_RIGHT);
	}
	
	if (keyboard.isKeyDown(keyboard.KEY_SPACE) == true && !this.falling && !this.jumping && this.dead == false)
	{
		jump = true
	}
	break;
	}
	this.sprite.update(deltaTime);

	
	var wasleft = this.velocity.x < 0;
	var wasright = this.velocity.x > 0;
	var falling = this.falling;
	var ddx = 0; // acceleration
	var ddy = GRAVITY;

	if (left)
	ddx = ddx - ACCEL; // player wants to go left
	else if (wasleft)
	ddx = ddx + FRICTION; // player was going left, but not any more
	if (right)
	ddx = ddx + ACCEL; // player wants to go right
	else if (wasright)
	ddx = ddx - FRICTION; // player was going right, but not any more
	if (jump && !this.jumping && !falling)
	{
		// apply an instantaneous (large) vertical impulse
		ddy = ddy - JUMP;
		this.jumping = true;
		this.sprite.setAnimation(ANIM_JUMP_RIGHT)
	}

	// calculate the new position and velocity:
	this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
	this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX * this.speed, MAXDX * this.speed);
	this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);
	
		// calculate the new position and velocity:
	this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
	this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX * this.speed, MAXDX * this.speed);
	this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);
	if ((wasleft && (this.velocity.x > 0)) ||
	(wasright && (this.velocity.x < 0)))
	{
		// clamp at zero to prevent friction from making us jiggle side to side
		this.velocity.x = 0;
	}

	
	// we’ll insert code here later
	// collision detection
	// Our collision detection logic is greatly simplified by the fact that the
	// player is a rectangle and is exactly the same size as a single tile.
	 // So we know that the player can only ever occupy 1, 2 or 4 cells.

	// This means we can short-circuit and avoid building a general purpose
	// collision detection engine by simply looking at the 1 to 4 cells that
	// the player occupies:
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x)%TILE; // true if player overlaps right
	var ny = (this.position.y)%TILE; // true if player overlaps below
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
	
	// If the player has vertical velocity, then check to see if they have hit a platform
	// below or above, in which case, stop their vertical velocity, and clamp their
	// y position:
	if (this.velocity.y > 0) 
	{
		if ((celldown && !cell) || (celldiag && !cellright && nx)) 
		{
			// clamp the y position to avoid falling into platform below
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0; // stop downward velocity
			this.falling = false; // no longer falling
			this.jumping = false; // (or jumping)
			ny = 0; // no longer overlaps the cells below
		}
	}
	
	else if (this.velocity.y < 0) 
	{
		if ((cell && !celldown) || (cellright && !celldiag && nx)) 
		{
			// clamp the y position to avoid jumping into platform above
			this.position.y = tileToPixel(ty + 1);
			this.velocity.y = 0; // stop upward velocity
			// player is no longer really in that cell, we clamped them to the cell below
			cell = celldown;
			cellright = celldiag; // (ditto)
			ny = 0; // player no longer overlaps the cells below
		}
	}

	if (this.velocity.x > 0) 
	{
		if ((cellright && !cell) || (celldiag && !celldown && ny)) 
		{
			// clamp the x position to avoid moving into the platform we just hit
			this.position.x = tileToPixel(tx);
			this.velocity.x = 0; // stop horizontal velocity
			if (this.sprite.currentAnimation != ANIM_IDLE_RIGHT)
			{
				this.sprite.setAnimation(ANIM_IDLE_RIGHT);
			}
		}
	}
	else if (this.velocity.x < 0) 
	{
		if ((cell && !cellright) || (celldown && !celldiag && ny)) 
		{
			// clamp the x position to avoid moving into the platform we just hit
			this.position.x = tileToPixel(tx + 1);
			this.velocity.x = 0; // stop horizontal velocity
		}
	}
	
	
	if(cellAtTileCoord(LAYER_OBJECT_TRIGGERS, tx, ty) == true)
	{
			this.velocity.x = 0;
			this.jumping = false;
			this.falling = true;
			this.dead = true;
			if (this.sprite.currentAnimation != ANIM_DEATH_RIGHT)
			{
				this.sprite.setAnimation(ANIM_DEATH_RIGHT);
			}
	}

	
	
	// Hacks and "Checkpoints"
	if (keyboard.isKeyDown(keyboard.KEY_0) == true)
	{
		this.position.y = -50;
	}
	if (keyboard.isKeyDown(keyboard.KEY_1) == true)
	{
		//"Put a breakpoint here to freeze the game at will"
		var freezethegamehere = 1;
	}
	if (keyboard.isKeyDown(keyboard.KEY_2) == true)
	{
		this.position.y = 432;
		this.position.x = 5280;
		camera.origin.x = 5296 - 500;
	}
	if (keyboard.isKeyDown(keyboard.KEY_3) == true)
	{
		this.position.y = 432;
		this.position.x = 7834;
		camera.origin.x = 7834 - 500;
	}
	if (keyboard.isKeyDown(keyboard.KEY_4) == true)
	{
		this.position.y = 432;
		this.position.x = 8600;
		camera.origin.x = 8600 - 500;
	}
	
	
	// hack to shortcut to end of level
	if (keyboard.isKeyDown(keyboard.KEY_9) == true)
	{
		this.position.x = 905*TILE
		camera.origin.x = 900*TILE
	}
	
	if (keyboard.isKeyDown(keyboard.KEY_8) == true)
	{
		this.position.y = -50;
		this.position.x = 380* TILE;
		camera.origin.x = 370*TILE

	}
	if (keyboard.isKeyDown(keyboard.KEY_8) == true)
	{
		this.position.y = -50;
		this.position.x = 380* TILE;
		camera.origin.x = 370*TILE
	}
	
	
	
	
	
	

}





Player.prototype.draw = function()
{
	this.sprite.draw(context, this.position.x - this.width/2 - camera.worldOffsetX , this.position.y - this.height);
}