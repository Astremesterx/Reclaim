CREATE TABLE `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`action` text NOT NULL,
	`target` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `blocks` (
	`owner` text NOT NULL,
	`blocked` text NOT NULL,
	PRIMARY KEY(`owner`, `blocked`)
);
--> statement-breakpoint
CREATE TABLE `bookmarks` (
	`owner` text NOT NULL,
	`target` text NOT NULL,
	PRIMARY KEY(`owner`, `target`)
);
--> statement-breakpoint
CREATE TABLE `source_checks` (
	`id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`status` text NOT NULL,
	`checked` text NOT NULL,
	`hash` text,
	`review` text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`post` text NOT NULL,
	`parent` text,
	`owner` text NOT NULL,
	`alias` text NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`created` text NOT NULL,
	FOREIGN KEY (`post`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_comments_post` ON `comments` (`post`);--> statement-breakpoint
CREATE TABLE `plans` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`payload` text NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_plans_owner` ON `plans` (`owner`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`alias` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`category` text NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`resolved` integer DEFAULT 0 NOT NULL,
	`accepted` text,
	`created` text NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_posts_status_created` ON `posts` (`status`,`created`);--> statement-breakpoint
CREATE INDEX `idx_posts_owner` ON `posts` (`owner`);--> statement-breakpoint
CREATE TABLE `profiles` (
	`owner` text PRIMARY KEY NOT NULL,
	`alias` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reminders` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`title` text NOT NULL,
	`due` text NOT NULL,
	`frequency` text NOT NULL,
	`timezone` text NOT NULL,
	`paused` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_reminders_owner` ON `reminders` (`owner`);--> statement-breakpoint
CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`target` text NOT NULL,
	`reason` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `votes` (
	`owner` text NOT NULL,
	`post` text NOT NULL,
	PRIMARY KEY(`owner`, `post`),
	FOREIGN KEY (`post`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_votes_post` ON `votes` (`post`);