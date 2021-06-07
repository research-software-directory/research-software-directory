# Make your instance available to others by hosting it online (deployment)

Amazon Web Services (AWS) is a online service provider that offers all kinds of
services relating to compute, storage, and hosting. The Netherlands eScience
Center uses AWS to run their instance of the Research Software Directory. This
section describes how to deploy your own customized instance of the Research
Software Directory to AWS.

Go to [https://aws.amazon.com/console/](https://aws.amazon.com/console/). Once there, you'll see something like:

[![AWS Management Console login](/docs/images/aws-management-console-login.png)](/docs/images/aws-management-console-login.png)

Create a free account if you don't already have one, and subsequently click
``Sign In to the Console``.

Once in the console, you'll be presented with an overview of all the services
that Amazon Web Services has to offer:

[![AWS Management Console Services Overview](/docs/images/aws-management-console-services-overview.png)](/docs/images/aws-management-console-services-overview.png)

It's easy to get lost in this plethora of services, but for running an instance
of the Research Software Directory, you'll only need 3 of them:

1. **EC2**: this is where we will run your customized instance of the Research
Software Directory and host it online; [jump to the EC2 section](#configuring-ec2)
1. **IAM**: we use this to create a user with limited privileges, so we don't
have to use root credentials when we don't have to; [jump to the IAM section](#configuring-iam)
1. **S3**: this is where we will store our daily backups; [jump to the S3 section](#configuring-s3)

## Configuring EC2

In the ``All Services`` overview, click ``EC2`` or use this link
[https://console.aws.amazon.com/ec2](https://console.aws.amazon.com/ec2).

<!-- TODO how to configure default zone -->

1. Click the blue ``Launch instance`` button
1. Scroll down to where it says ``Ubuntu Server 18.04 LTS``, click ``Select``
1. Choose instance type ``t2.small``
1. Proceed in the wizard until you get to 'Add storage'. Set the storage to 10GB.
1. Proceed in the wizard by clicking ``Next`` until you get to ``Configure
Security Group``. It should already have one rule listed. However, its security
settings should be a bit more secure, because currently it allows SSH
connections from any IP. Click the ``Source`` dropdown button, select ``My IP``.
1. Now click the blue ``Review and Launch`` button in the lower right corner
1. In the ``Review`` screen,  click the blue ``Launch`` button in the lower
right corner to bring the instance up
1. In the ``Keypair`` popup, select ``Create a new key pair``, try to give it a
meaningful name, e.g. ``rsd-instance-on-aws`` or something
1. Click ``Download Key Pair``, save the ``*.pem`` file in ``~/.ssh`` on your
local machine, then click ``Launch Instances`` (it takes a moment to
initialize).
1. On your local machine, open a terminal and go to ``~/.ssh``. Change the
permissions of the key file to octal 400 (readable only by user):

    ```shell
    chmod 400 <the keyfile>
    ```
1. Verify that the ``.ssh`` directory itself has octal permission 700 (readable,
writable, and executable by user only).
1. Go back to Amazon, click ``View instances``
1. Make a note of your instance's public IPv4, e.g. ``3.92.182.176``
1. On your own machine use a terminal to log in to your instance
1. ``ssh -i path-to-the-keyfile ubuntu@<your-instance-public-ip>``
1. Once logged in to the remote machine, update the package manager's list of
   software packages and their versions:

    ```shell
    sudo apt update
    ```

1. Upgrade any software packages to a higher version if available:

    ```shell
    sudo apt upgrade
    ```

1. Install ``docker`` and
``docker-compose``, then add user ``ubuntu`` to the group ``docker``, same as
before (see section _Documentation for developers_
[above](/README.md#documentation-for-developers)).
1. Make a new directory and change into it:

    ```shell
    cd ~
    mkdir rsd
    cd rsd
    ```
1. The machine should have ``git`` installed, use it to ``git clone`` your
customized Research Software Directory instance into the current directory as
follows:

    ```shell
    git clone https://github.com/<your-github-organization>/research-software-directory.git .
    ```
    (Note the dot at the end)

1. Open a new terminal and secure-copy your local ``rsd-secrets.env`` file to
the Amazon machine as follows:

    ```shell
    cd <where rsd-secrets.env is>
    scp -i path-to-the-keyfile ./rsd-secrets.env \
    ubuntu@<your-instance-public-ip>:/home/ubuntu/rsd/rsd-secrets.env
    ```
1. On the remote machine, create the symlink named `.env` and have it point to the secrets file:

    ```shell
    ln -s rsd-secrets.env .env
    ```

1. Follow the instructions
[above](/README.md#auth_github_client_id-and-auth_github_client_secret) to make
a second key pair ``AUTH_GITHUB_CLIENT_ID`` and ``AUTH_GITHUB_CLIENT_SECRET``.
However, let this one's ``Authorization callback url`` be ``https://`` plus your
instance's IPv4 plus ``/auth/get_jwt``. Update the Amazon copy of
``rsd-secrets.env`` according to the new client ID and secret.
1. Start the Research Software Directory instance with:

    ```shell
    cd ~/rsd
    docker-compose build
    docker-compose up -d
    ```
1. On your local machine, open a new terminal. Connect to the Amazon instance,
run the harvesters, and resolve the foreign keys:

    ```shell
    ssh -i path-to-the-keyfile ubuntu@<your-instance-public-ip>
    cd ~/rsd
    docker-compose exec harvesting python app.py harvest all
    docker-compose exec harvesting python app.py resolve all
    ```

At this point we should have a world-reachable, custom instance of the Research
Software Directory running at ``https://<your-instance-public-ip>/``. However,
if we go there using a browser like Firefox or Google Chrome, we get a warning
that the connection is not secure.

To fix this, we need to configure the security credentials, but this in turn
requires us to claim a domain and configure a DNS record. There are free
services available that you can use for this, e.g. [https://noip.com](https://noip.com). Here's how:

1. Go to [https://noip.com](https://noip.com), sign up and log in.
1. Under My services, find ``DNS Records``
1. Click the ``Add a hostname`` button
1. Choose your free (sub)domain name, e.g. I chose ``myrsd.ddns.net``
1. Fill in the IP address of your Amazon machine. In my case,
[https://myrsd.ddns.net](https://myrsd.ddns.net) will serve as an alias for [https://3.92.182.176](https://3.92.182.176)
1. Once you have the (sub)domain name, update ``DOMAIN`` and ``SSL_DOMAINS`` in the file
``rsd-secrets.env`` on your Amazon instance (leave out the ``https://`` part, as
well as anything after the ``.com``, ``.nl``, ``.org`` or whatever you may
have).
1. Fill in your e-mail for ``SSL_ADMIN_EMAIL``.
1. Finally, revisit your OAuth app here [https://github.com/settings/developers](https://github.com/settings/developers),
replace the Amazon IP address in the ``Authorization callback url`` with
your freshly minted domain name.
1. Now, stop the Research Software Directory if it is still running with Ctrl-c
or ``docker-compose stop``.
1. Start the Research Software Directory back up

    ```shell
    cd ~/rsd
    docker-compose up -d
    ```
1. Pointing your browser to your (sub)domain name should now show your instance
of the Research Software Directory (although be aware that sometimes it takes a
while before the domain name resolves to the IP address.

## Configuring IAM

1. In the ``All Services`` overview, click ``IAM`` or use this link
[https://console.aws.amazon.com/iam](https://console.aws.amazon.com/iam).
1. In the menu on the left, click ``Groups``.
1. Click the ``Create New Group`` button.
1. Name the group ``s3-users``.
1. When asked to attach a (security) policy, use the search bar to find
``AmazonS3FullAccess`` and check its checkbox.
1. Click the ``Next step`` button in the lower right corner.
1. Review your group, go back if need be. When you're ready, click the ``Create
Group`` button in the lower right corner.
1. Now you should be presented with a group, but the group is still empty; there
are no users.
1. In the menu on the left, click ``Users``.
1. Click the ``Add user`` button in the top left corner.
1. Choose your user name. I chose to call mine ``rsd-backup-maker``. For this
user, check the checkbox labeled ``Programmatic access``. This user won't need
``AWS Management Console access``, so leave that box unchecked.
1. In the lower right corner, click the ``Next: Permissions`` button.
1. Select ``Add user to group``, and make user ``rsd-backup-maker`` a member of
group ``s3-users``.
1. In the lower right corner, click the ``Next: Tags`` button. We don't need to
assign any tags, so proceed to the next page by clicking ``Next: Review``. Go
back if you need to, but if everything looks OK, click ``Create User``. You will
be presented with the new user's credentials. Download the CSV file now; we'll
use the ``Access key ID`` and the ``Secret access key`` later to set up the
backup mechanism.

## Configuring S3

In the ``All Services`` overview, click ``S3`` or use this link
[https://console.aws.amazon.com/s3](https://console.aws.amazon.com/s3).

1. create a bucket with a random name (bucket names must be globally unique;
websites like [https://www.random.org/strings/](https://www.random.org/strings/) are useful to get a random string)
1. in that bucket, make a directory, e.g. ``rsd-backups``
1. The backup service contains a program
([xenon-cli](https://github.com/xenon-middleware/xenon-cli)) that can copy to a range of
storage providers. You can use it to make daily backups of the MongoDB database,
and store the backups on Amazon's S3. For this, configure the environmental
variable ``BACKUP_CMD`` as follows (naturally, you'll need to use a different
location, username, and password; see explanation below):

    ```shell
    BACKUP_CMD='xenon filesystem s3 \
    --location http://s3-us-west-2.amazonaws.com/nyor-yiwy-fepm-dind/ \
    --username AKIAJ52LWSUUKATRQZ2A \
    --password xQ3ezZLKN7XcxIwRko2xkKhV9gdJ5etA4OyLbXN/ \
    upload rsd-backup.tar.gz /rsd-backups/rsd-backup-$BACKUP_DATE.tar.gz'
    ```

    - The bucket name is ``nyor-yiwy-fepm-dind``. It is physically located in
    zone ``us-west-2``.
    - We access the bucket as a limited-privileges IAM user, for whom we
    created an access key (it has been deactivated since). The Access key ID is
    ``AKIAJ52LWSUUKATRQZ2A``, and its corresponding Secret access key is
    ``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``.
    - The variable ``BACKUP_DATE`` is set by the backup script (see
    [``/backup/backup.sh``](/backup/backup.sh)); no need to change this for your application.
    - ``rsd-backup.tar.gz`` is the name of the backup archive as it is called
    inside the container; no need to change this for your application.
    - ``/rsd-backups/rsd-backup-$BACKUP_DATE.tar.gz`` is the path inside
    the bucket. It includes the date to avoid overwriting previously existing
    archives; no need to change this for your application.
1. Test the setup by stopping the Research Software Directory on Amazon, by

    ```shell
    # ssh into the remote machine
    cd rsd
    docker-compose stop
    # update BACKUP_CMD by editing the rsd-secrets.env file
    docker-compose up -d
    ```

    Wait until the Research Software Directory is up and running again, then

    ```shell
    docker-compose exec backup /bin/sh
    /app # /bin/sh backup.sh
    ```
